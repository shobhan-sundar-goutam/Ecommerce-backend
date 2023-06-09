import express from 'express';
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from '../controllers/category.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import AuthRoles from '../utils/authRoles.js';

const router = express.Router();

router.get('/categories', getAllCategories);

router.post('/admin/category', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), createCategory);
router.put('/admin/category/:id', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), updateCategory);
router.delete('/admin/category/:id', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), deleteCategory);

export default router;
