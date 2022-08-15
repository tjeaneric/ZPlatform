import express from 'express';
import { getAllUsers, updateProfile } from '../../controllers/userController';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  verifyOtp,
  verifyLoginCode,
  generateLoginLink,
  loginWithLoginLink,
} from '../../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/signup/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/login/login-with-link', generateLoginLink);
router.get('/login/:otp', loginWithLoginLink);
router.post('/login/verify-otp', verifyLoginCode);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateProfile', protect, updateProfile);

router.get('/', protect, getAllUsers);

export default router;
