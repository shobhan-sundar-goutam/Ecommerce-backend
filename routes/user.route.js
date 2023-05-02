import express from 'express';
import { signUp, login } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/auth/signup', signUp);
router.post('/auth/login', login);

export default router;
