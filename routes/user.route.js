import express from 'express';
import {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfileDetails,
} from '../controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/auth/signup', signUp);
router.post('/auth/login', login);
router.get('/auth/logout', logout);
router.post('/auth/password/forgot', forgotPassword);
router.post('/auth/password/reset/:token', resetPassword);
router.get('/auth/profile', isLoggedIn, getUserProfileDetails);

export default router;
