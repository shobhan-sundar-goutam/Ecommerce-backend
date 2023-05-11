import express from 'express';
import {
    changePassword,
    deleteUser,
    forgotPassword,
    getAllUsers,
    getUserById,
    getUserProfile,
    login,
    logout,
    resetPassword,
    signUp,
    updateUserProfile,
    updateUserRole,
} from '../controllers/user.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import AuthRoles from '../utils/authRoles.js';

const router = express.Router();

router.post('/auth/signup', signUp);
router.post('/auth/login', login);
router.get('/auth/logout', logout);
router.post('/auth/password/forgot', forgotPassword);
router.post('/auth/password/reset/:token', resetPassword);
router.get('/auth/profile', isLoggedIn, getUserProfile);
router.put('/auth/password/update', isLoggedIn, changePassword);
router.put('/auth/profile/update', isLoggedIn, updateUserProfile);

router.get('/admin/users', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), getAllUsers);
router.get('/admin/user/:id', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), getUserById);
router.put('/admin/user/:id', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), updateUserRole);
router.delete('/admin/user/:id', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), deleteUser);

export default router;
