import Product from '../models/product.schema.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/customError.js';

export const createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();

    if (!products) {
        throw new CustomError('No products found', 404);
    }

    res.status(200).json({
        success: true,
        products,
    });
});
