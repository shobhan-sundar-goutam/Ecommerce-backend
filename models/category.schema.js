import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      maxLength: [120, 'Category name should not be more than 120 characters'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
