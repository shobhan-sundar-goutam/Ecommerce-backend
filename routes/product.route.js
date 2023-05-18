import express from 'express';
import {
    createProduct,
    createProductReview,
    deleteProduct,
    deleteProductReview,
    getAllProducts,
    getAllProductsForAdmin,
    getProductById,
    getProductReviews,
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
router.get('/admin/products', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), getAllProductsForAdmin);

router.put('/review', isLoggedIn, createProductReview);
router.delete('/review', isLoggedIn, deleteProductReview);
router.get('/reviews', getProductReviews);

export default router;
