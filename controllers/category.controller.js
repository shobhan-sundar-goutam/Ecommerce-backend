import Category from '../models/category.schema.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/customError.js';

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new CustomError('Please provide a category name', 400);
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        throw new CustomError(`${name} category already exists`, 409);
    }

    const category = await Category.create({ name });

    res.status(201).json({
        success: true,
        message: `${category.name} category is created`,
        category,
    });
});

export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!category) {
        throw new CustomError('Failed to update category', 500);
    }

    res.status(200).json({
        success: true,
        message: `category is updated to ${category.name}`,
        category,
    });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        throw new CustomError('Failed to delete category', 500);
    }

    res.status(200).json({
        success: true,
        message: `${category.name} category is deleted`,
        category,
    });
});

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    if (!categories) {
        throw new CustomError('No categories found', 404);
    }

    res.status(200).json({
        success: true,
        categories,
    });
});
