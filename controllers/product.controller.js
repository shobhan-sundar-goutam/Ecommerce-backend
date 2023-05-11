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

export const getAllProducts = asyncHandler(async (_req, res) => {
    const products = await Product.find();

    if (!products) {
        throw new CustomError('No products found', 404);
    }

    res.status(200).json({
        success: true,
        products,
    });
});

export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new CustomError('Product does not exist', 404);
    }

    res.status(200).json({
        success: true,
        product,
    });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!product) {
        throw new CustomError('Product not found', 404);
    }

    res.status(200).json({
        success: true,
        product,
    });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        throw new CustomError('Product not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        product,
    });
});
