import express from 'express';
import { signUp, login, logout } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/auth/signup', signUp);
router.post('/auth/login', login);
router.get('/auth/logout', logout);

export default router;
