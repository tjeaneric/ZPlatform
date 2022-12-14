import express from 'express';
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateProfile,
} from '../../controllers/userController';
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
  logout,
  accountVerification,
  verifyUser,
} from '../../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/signup/verify-otp', verifyOtp);

router.post('/login', login);
router.post('/login/login-with-link', generateLoginLink);
router.get('/login/:otp', loginWithLoginLink);
router.post('/login/verify-otp', verifyLoginCode);

router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateProfile', protect, updateProfile);

router.patch('/verify-account', protect, accountVerification);

router.patch('/verify-user', protect, verifyUser);

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUser);
router.delete('/:id', protect, deleteUser);

export default router;
