import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name'],
            trim: true,
            maxLength: [120, 'Product name should be a maximum of 120 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide product description'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a product price'],
            maxLength: [8, 'Product price should not be more than 8 characters'],
        },
        stock: {
            type: Number,
            required: [true, 'Please provide product stock'],
            maxLength: [4, 'Product stock should not be more than 4 characters'],
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        rating: {
            type: Number,
            default: 0,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        numberOfReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Product', productSchema);
