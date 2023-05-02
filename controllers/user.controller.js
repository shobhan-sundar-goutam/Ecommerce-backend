import User from '../models/user.schema.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/customError.js';
import config from '../config/index.js';

const cookieOptions = {
  expires: new Date(Date.now() + config.COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

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

  const token = user.getJWTToken();

  user.password = undefined;

  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    success: true,
    token,
    user,
  });
});
