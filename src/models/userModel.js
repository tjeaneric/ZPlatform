import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import PasswordValidator from 'password-validator';
import crypto from 'crypto';

const schema = new PasswordValidator();

schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123', 'admin123']);

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    validate: {
      validator: function (el) {
        // eslint-disable-next-line no-useless-escape
        return /\b[\d\-\/@#$]{12}\b/.test(el);
      },
      message: 'Phone number should have 10 digits',
    },
  },
  profilePhoto: String,
  gender: {
    type: String,
    required: [true, 'Please enter your gender'],
    enum: {
      values: ['male', 'female'],
      message: 'Gender is either: male or female',
    },
  },
  age: {
    type: Number,
    required: [true, 'Please enter your age'],
  },
  dateOfBirth: {
    type: String,
    required: [true, 'Please enter your date of birth'],
  },
  maritalStatus: {
    type: String,
    required: [true, 'Please enter your marital status'],
    enum: {
      values: ['single', 'married', 'divorced', 'widowed'],
      message: 'marital status is either: single,married,divorced, widowed',
    },
  },
  active: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: String,
    enum: {
      values: ['UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED'],
    },
    default: 'UNVERIFIED',
  },
  nationality: {
    type: String,
    required: [true, 'Please enter your nationality'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    validate: {
      validator: function (el) {
        return schema.validate(el);
      },
      message: 'Weak password',
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please comfirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  //only run this function if password field was modified
  if (!this.isModified('password')) return next();
  //Hash password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete passwordConfirm field;
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  //False means Not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
