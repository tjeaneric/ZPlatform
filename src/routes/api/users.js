import express from 'express';
import { getAllUsers, updateProfile } from '../../controllers/userController';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} from '../../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateProfile', protect, updateProfile);

router.get('/', protect, getAllUsers);

export default router;
