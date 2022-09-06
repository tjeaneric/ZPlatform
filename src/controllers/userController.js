import catchAsync from '../utils/catchAsync';
import User from '../models/userModel';
import AppError from '../utils/appError';
import filterObj from '../utils/filterObj';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'sucess',
    results: users.length,
    data: {
      users,
    },
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  //1)Create error if user try to update password(User POSTS password)
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This address is not for password update. Please use /updateMyPassword',
        400
      )
    );
  }
  //2)filtered out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'maritalStatus',
    'nationality'
  );

  //3)check if filteredBody object is empty
  if (Object.keys(filteredBody).length === 0) {
    return next(new AppError('Please update allowed fields only ', 400));
  }
  //4)Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
};

export const deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Deleted successfully',
    data: null,
  });
};
