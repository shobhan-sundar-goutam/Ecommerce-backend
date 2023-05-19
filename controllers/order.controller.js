import Order from '../models/order.schema.js';
import Product from '../models/product.schema.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/customError.js';

export const createOrder = asyncHandler(async (req, res) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (
        !(
            shippingInfo &&
            orderItems &&
            paymentInfo &&
            itemsPrice &&
            taxPrice &&
            shippingPrice &&
            totalPrice
        )
    ) {
        throw new CustomError('Please fill all the details', 400);
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});

export const getSingleOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        throw new CustomError('Order not found', 404);
    }

    res.status(200).json({
        success: true,
        order,
    });
});

export const myOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
        throw new CustomError('No orders found', 404);
    }

    res.status(200).json({
        success: true,
        orders,
    });
});

export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();

    if (!orders) {
        throw new CustomError('No orders found', 404);
    }

    const totalAmount = orders.reduce(
        (amount, currentOrder) => amount + currentOrder.totalPrice,
        0
    );

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

async function updateProductStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

export const updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new CustomError('Order not found', 404);
    }

    if (order.orderStatus === 'Delivered') {
        throw new CustomError('Order is already delivered', 404);
    }

    order.orderStatus = req.body.orderStatus;

    order.orderItems.forEach(async (order) => {
        await updateProductStock(order.product, order.quantity);
    });

    if (req.body.orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

export const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
        throw new CustomError('Order not found', 404);
    }

    res.status(200).json({
        success: true,
        order,
    });
});
