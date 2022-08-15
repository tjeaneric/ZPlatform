import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import crypto from 'crypto';
import otpGenerator from 'otp-generator';
import User from '../models/userModel';
import Otp from '../models/otpModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import sendEmail from '../utils/sendEmail';
import sendSMS from '../utils/sendSMS';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  //remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;

  const existingUser = await User.findOne({ phoneNumber });
  //Check if user exists and is active
  if (existingUser && existingUser.active) {
    return next(new AppError('User already exists', 400));
  }

  const otpNumber = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  sendSMS({
    clientPhone: `${phoneNumber}`,
    message: `ZPlatform verification code for ${phoneNumber} is: ${otpNumber}`,
  });

  //Check if user exists and is not active
  if (existingUser && !existingUser.active) {
    //Check if the number already has an OTP and replace it's value with a new one
    const existingOtpHolder = await Otp.findOne({ phone: phoneNumber });

    if (existingOtpHolder) {
      existingOtpHolder.otpCode = otpNumber;
      await existingOtpHolder.save({ validateBeforeSave: false });
    } else {
      await Otp.create({ phone: phoneNumber, otpCode: otpNumber });
    }

    return next(
      new AppError(
        'User already exists and Otp code is sent to your phone number, Please  verify your phone number',
        400
      )
    );
  }

  await Otp.create({ phone: phoneNumber, otpCode: otpNumber });

  await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    age: req.body.age,
    dateOfBirth: req.body.dateOfBirth,
    maritalStatus: req.body.maritalStatus,
    nationality: req.body.nationality,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(200).json({
    status: 'success',
    message:
      'Please Check SMS sent to your number and Verify your phone number',
  });
});

export const verifyOtp = catchAsync(async (req, res, next) => {
  const { phone, otpCode } = req.body;

  //1)Check if phone number & otp code exist.
  if (!phone || !otpCode) {
    return next(new AppError('Please provide phone number and otp code', 400));
  }

  const activeUser = await User.findOne({ phoneNumber: phone });

  if (activeUser.active) {
    return next(new AppError('Phone number already verified', 400));
  }

  const userOtp = await Otp.findOne({ phone });

  if (!userOtp) return next(new AppError(`No Otp code sent to ${phone}`, 400));

  if (!(await userOtp.correctOtpCode(otpCode, userOtp.otpCode))) {
    return next(new AppError('Incorrect Otp code', 401));
  }

  activeUser.active = true;
  activeUser.save({ validateBeforeSave: false });
  await Otp.findOneAndDelete({ phone });

  res.status(200).json({
    status: 'success',
    message: 'Phone number successfully verified, Please proceed to login',
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1)Check if email & password exist.
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2)Check if user exist and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user.active) {
    return next(new AppError('Please verify your phone number first', 401));
  }

  //Check if the number already has an OTP and replace it's value with a new one
  const existingOtpHolder = await Otp.findOne({ phone: user.phoneNumber });

  const otpNumber = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  if (existingOtpHolder) {
    existingOtpHolder.otpCode = otpNumber;
    await existingOtpHolder.save({ validateBeforeSave: false });
  } else {
    await Otp.create({ phone: user.phoneNumber, otpCode: otpNumber });
  }

  //3)if everything is ok, then send OTP to user
  sendSMS({
    clientPhone: `${user.phoneNumber}`,
    message: `ZPlatform login OTP code for ${user.phoneNumber} is: ${otpNumber}`,
  });

  res.status(200).json({
    status: 'success',
    message: 'Please Check SMS sent to your number',
  });
});

export const generateLoginLink = catchAsync(async (req, res, next) => {
  let generatedOtp;
  const { email } = req.body;
  //Check if email is provided
  if (!email) return next(new AppError('Please provide your email', 400));

  //Check if user exist and password is correct
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  //Check if the number already has an OTP and replace it's value with a new one
  const existingOtpHolder = await Otp.findOne({ phone: user.phoneNumber });

  const otpNumber = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  if (existingOtpHolder) {
    existingOtpHolder.otpCode = otpNumber;
    generatedOtp = await existingOtpHolder.save({ validateBeforeSave: false });
  } else {
    generatedOtp = await Otp.create({
      phone: user.phoneNumber,
      otpCode: otpNumber,
    });
  }

  //send login link to the user's email

  const loginLinkURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/login/${generatedOtp.otpCode}`;

  const message = `You can login in using this link: \n ${loginLinkURL}. \n \n  This link expires in 5 minutes`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'ZPlatform Login link',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Login Link sent to your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email, Try again later!', 500)
    );
  }
});

export const loginWithLoginLink = catchAsync(async (req, res, next) => {
  const linkOtp = req.params.otp;

  const userOtp = await Otp.findOne({ otpCode: linkOtp });

  if (!userOtp) {
    return next(new AppError('Incorrect otp code', 401));
  }

  const user = await User.findOne({ phoneNumber: userOtp.phone });
  await Otp.findOneAndDelete({ phone: userOtp.phone });

  createSendToken(user, 200, res);
});

export const verifyLoginCode = catchAsync(async (req, res, next) => {
  const { phone, otpCode } = req.body;

  //1)Check if phone number & otp code exist.
  if (!phone || !otpCode) {
    return next(new AppError('Please provide phone number and otp code', 400));
  }

  const userOtp = await Otp.findOne({ phone });

  if (!userOtp) return next(new AppError(`No Otp code sent to ${phone}`, 400));

  if (!(await userOtp.correctOtpCode(otpCode, userOtp.otpCode))) {
    return next(new AppError('Incorrect Otp code', 401));
  }

  await Otp.findOneAndDelete({ phone });
  const user = await User.findOne({ phoneNumber: phone });

  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  //1)get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === null || token === undefined) {
    return next(
      new AppError('You are not logged in!. Please log in to get access', 401)
    );
  }
  //2)verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3)Check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist', 401)
    );
  }
  //4)Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password!. Please log in again.', 401)
    );
  }
  //Grant access to protected route
  req.user = currentUser;
  next();
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  //1)get user based on Posted email
  const { email } = req.body;
  if (!email) return next(new AppError('Please enter your email address', 400));

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  //2)Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)send token to the user's email

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: \n ${resetURL}. \n \n  If you didn't forget your password, Please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password reset Token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email, Try again later!', 500)
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2)If the token has not expired and there is user, set new Password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //3) update changedPasswordAt  property for the user

  //4)Log the user in, Send JWT to the user
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  //1)Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //2)Check if POSTED current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong!', 401));
  }

  //3)If yes, Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4)Log in the user with updated password , send JWT
  createSendToken(user, 200, res);
});
