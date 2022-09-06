import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (el) {
          // eslint-disable-next-line no-useless-escape
          return /\b[\d\-\/@#$]{12}\b/.test(el);
        },
        message: 'Phone number should have 12 digits',
      },
    },
    otpCode: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 },
    },
  },
  { timestamps: true }
);

otpSchema.methods.correctOtpCode = function (candidateOtp, userOtp) {
  return candidateOtp === userOtp;
};

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
