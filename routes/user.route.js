import express from 'express';
import {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/auth/signup', signUp);
router.post('/auth/login', login);
router.get('/auth/logout', logout);
router.post('/auth/password/forgot', forgotPassword);
router.post('/auth/password/reset/:token', resetPassword);

export default router;
