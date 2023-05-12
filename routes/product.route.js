import express from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from '../controllers/product.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import AuthRoles from '../utils/authRoles.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/product/:id', getProductById);

router.post('/admin/product', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), createProduct);
router.put('/admin/product/:id', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), updateProduct);
router.delete('/admin/product/:id', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), deleteProduct);

export default router;
