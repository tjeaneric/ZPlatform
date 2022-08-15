import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      required: true,
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

otpSchema.methods.correctOtpCode = async function (candidateOtp, userOtp) {
  return await bcrypt.compare(candidateOtp, userOtp);
};

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
