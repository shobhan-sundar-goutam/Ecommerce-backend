import express from 'express';
import { createProduct, getAllProducts } from '../controllers/product.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import AuthRoles from '../utils/authRoles.js';

const router = express.Router();

router.post('/products', getAllProducts);
router.post('/product', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), createProduct);

export default router;
