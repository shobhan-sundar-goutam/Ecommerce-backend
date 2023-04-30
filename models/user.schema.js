import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import AuthRoles from '../utils/authRoles';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a your Name'],
      maxLength: [50, 'Name must be less than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid Email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your Password'],
      minLength: [8, 'Password should be greater than 8 characters'],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

export default mongoose.model('User', userSchema);
