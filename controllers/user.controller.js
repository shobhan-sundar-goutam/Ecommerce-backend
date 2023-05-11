import crypto from 'crypto';
import User from '../models/user.schema.js';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/customError.js';
import sendEmail from '../utils/sendEmail.js';
import sendToken from '../utils/sendToken.js';

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

    if (!email) {
        throw new CustomError('Please provide your registered email id', 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const resetToken = user.generateForgotPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/auth/password/reset/${resetToken}`;

    const text = `Hey ${user.name}, we received a request to reset your password for your Shop-e-zone account. To proceed, please click on the following link :- \n\n ${resetPasswordUrl} \n\nIf you haven't requested this email, please ignore it. \n\nPlease note that for security reasons, the link above will expire within 20 minutes. If the link has expired, you can request another password reset by clicking on the "Forgot Password" link on our login page. \n\nThank you for using Shop-e-zone! \n\nBest regards,\nShobhan Sundar Goutam (Founder, Shop-e-zone)`;

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

        throw new CustomError(error.message || 'Password reset email failed to send', 500);
    }
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (!(password && confirmPassword)) {
        throw new CustomError('Please fill all the details', 400);
    }

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new CustomError('Reset Password Token is Invalid or has been expired', 400);
    }

    if (password !== confirmPassword) {
        throw new CustomError('Password and Confirm Password does not match', 400);
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    user.password = undefined;

    sendToken(user, 200, res);
});

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new CustomError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        user,
    });
});

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!(oldPassword && newPassword && confirmPassword)) {
        throw new CustomError('Please fill all the details', 400);
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
        throw new CustomError('User not found, Please login again', 404);
    }

    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
        throw new CustomError('Old Password is incorrect', 400);
    }

    if (newPassword !== confirmPassword) {
        throw new CustomError('New Password and Confirm Password does not match', 400);
    }

    user.password = newPassword;
    await user.save();

    sendToken(user, 200, res);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const newUserData = { name, email };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!user) {
        throw new CustomError('User not found, Please login again', 404);
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// ADMIN controllers

export const getAllUsers = asyncHandler(async (_req, res) => {
    const users = await User.find();

    if (!users) {
        throw new CustomError('No users found', 404);
    }

    res.status(200).json({
        success: true,
        users,
    });
});

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        throw new CustomError(`User does not exist with id :- ${id}`, 404);
    }

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const newUserData = { name, email, role };

    const user = await User.findByIdAndUpdate(id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!user) {
        throw new CustomError(`User does not exist with id :- ${id}`, 404);
    }

    res.status(200).json({
        success: true,
        message: `The role of ${user.name} is updated to ${user.role}`,
        user,
    });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new CustomError(`User does not exist with id :- ${id}`, 404);
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        user,
    });
});
