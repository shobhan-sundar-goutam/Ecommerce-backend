import Product from '../models/product.schema.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/customError.js';
import SearchFilters from '../utils/searchFilters.js';

export const createProduct = asyncHandler(async (req, res) => {
    req.body.user = req.user._id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

export const getAllProducts = asyncHandler(async (req, res) => {
    const resultPerPage = 6;
    const totalProductsCount = await Product.countDocuments();

    const searchFilters = new SearchFilters(Product.find(), req.query).search().filter();
    let products = await searchFilters.modelFind;

    const filteredProductsCount = products.length;

    searchFilters.pagination(resultPerPage);
    products = await searchFilters.modelFind.clone();

    res.status(200).json({
        success: true,
        products,
        resultPerPage,
        totalProductsCount,
        filteredProductsCount,
    });
});

export const getAllProductsForAdmin = asyncHandler(async (_req, res) => {
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

// Product Reviews

export const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const hasAlreadyReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (hasAlreadyReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                (review.rating = rating), (review.comment = comment);
            }
        });
    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    product.rating =
        product.reviews.reduce(
            (accumulator, currentReview) => accumulator + currentReview.rating,
            0
        ) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

export const getProductReviews = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        throw new CustomError('Product not found', 404);
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

export const deleteProductReview = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        throw new CustomError('Product not found', 404);
    }

    const reviews = product.reviews.filter(
        (review) => review._id.toString() !== req.query.id.toString()
    );

    const rating =
        reviews.reduce((accumulator, currentReview) => accumulator + currentReview.rating, 0) /
        reviews.length;

    const numberOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            rating,
            numberOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});
