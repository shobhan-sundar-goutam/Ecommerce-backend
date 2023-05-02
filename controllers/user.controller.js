import User from '../models/user.schema.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/customError.js';
import sendToken from '../utils/sendToken.js';

// Register/Signup
export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError('Please fill all the details', 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError('User already exists', 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'this is a public id',
      url: 'urlstring',
    },
  });

  user.password = undefined;

  sendToken(user, 201, res);
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new CustomError('Please fill all the details', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new CustomError('Invalid email or password', 401);
  }

  user.password = undefined;

  sendToken(user, 200, res);
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});
