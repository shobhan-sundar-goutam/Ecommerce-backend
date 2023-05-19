import express from 'express';
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getSingleOrder,
    myOrders,
    updateOrder,
} from '../controllers/order.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import AuthRoles from '../utils/authRoles.js';

const router = express.Router();

router.post('/order', isLoggedIn, createOrder);
router.get('/order/:id', isLoggedIn, getSingleOrder);
router.get('/orders/me', isLoggedIn, myOrders);

router.get('/admin/orders', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), getAllOrders);
router.put('/admin/order/:id', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), updateOrder);
router.delete('/admin/order/:id', isLoggedIn, authorizedRoles(AuthRoles.ADMIN), deleteOrder);

export default router;
