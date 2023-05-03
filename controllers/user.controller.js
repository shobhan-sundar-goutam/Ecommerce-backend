import User from '../models/user.schema.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/customError.js';
import sendToken from '../utils/sendToken.js';
import sendEmail from '../utils/sendEmail.js';

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

export const logout = asyncHandler(async (_req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const resetToken = user.generateForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/password/reset/${resetToken}`;

  const text = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you haven't requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Shop-e-zone password recovery',
      text,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new CustomError(
      error.message || 'Password reset email failed to send',
      500
    );
  }
});
