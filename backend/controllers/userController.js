const catchAsyncError = require("../middleware/catchAsyncError");
const userDB = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendMessage = require("../utils/sendMessage");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

exports.registerUser = catchAsyncError(async (req, res) => {
    const { name, email, password } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatar",
        width: 150,
        corp: "scale",
    });
    const user = await userDB.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });
    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("enter email and password", 400));
    }
    const user = await userDB.findOne({ email }).select("+password");

    if (!user) {
        return next(new Error("enter valid email and password", 400));
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        return next(new Error("enter valid email and password", 400));
    }
    sendToken(user, 200, res);
});

exports.logoutUser = catchAsyncError(async (req, res, next) => {
    const options = {
        httpOnly: true,
        expires: new Date(Date.now()),
    };
    res.cookie("token", null, options).status(200).json({
        success: true,
        message: "user logged out",
    });
});
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await userDB.findOne({ email: req.body.email });
    if (!user) {
        next(new ErrorHandler("email not found", 404));
    }
    const resetToken = user.getResetPasswordToken();
    console.log("reset password token created");
    await user.save({ validateBeforeSave: false });
    // const resetPasswordURL = `${process.env.FRONTEND_LINK}/password/reset/${resetToken}`;
    const resetPasswordURL = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;
    console.log("url", resetPasswordURL);
    const message = `Your password reset token is :-\n\n${resetPasswordURL} \n\n if not requested, please ignore`;

    try {
        await sendMessage({
            email: user.email,
            subject: "Ecommerse Reset password",
            message,
        });
        res.status(200).json({
            success: true,
            message: `email sent to ${user.email} successfully`,
        });
    } catch (err) {
        console.log("final error");
        (user.resetPassswordToken = undefined),
            (user.resetPasswordDate = undefined);
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(err.message, 500));
    }
    console.log("out of try catch");
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetToken = req.params.token;
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    const user = await userDB.findOne({
        resetPasswordToken,
        resetPasswordDate: { $gt: Date.now() },
    });
    if (!user) {
        next(new ErrorHandler("reset token is invalid or expired", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        next(new ErrorHandler("password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPassswordToken = undefined;
    user.resetPasswordDate = undefined;

    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await userDB.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await userDB.findById(req.user.id).select("+password");
    const isValidPassword = await user.comparePassword(req.body.oldPassword);
    if (!isValidPassword) {
        return next(new Error("enter correct old password", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new Error("confirm password do not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;
    const userData = { name, email };
    if (req.body.avatar !== "") {
        const user = await userDB.findById(req.user.id);

        const imageId = user.avatar.public_id;
        try {
            await cloudinary.v2.uploader.destroy(imageId);
        } catch (err) {
            console.log("destroy image", err);
        }
        try {
            const myCloud = await cloudinary.v2.uploader.upload(
                req.body.avatar,
                {
                    folder: "avatars",
                    width: 150,
                    crop: "scale",
                }
            );

            userData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        } catch (err) {
            console.log("create error", err);
        }
    }
    await userDB.findByIdAndUpdate(req.user.id, userData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await userDB.find();

    res.status(200).json({
        success: true,
        users,
    });
});

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await userDB.findById(req.params.id);
    if (!user) {
        next(new ErrorHandler(`no user found with id: ${req.params.id}`, 400));
    }
    res.status(200).json({
        success: true,
        user,
    });
});

exports.updateUser = catchAsyncError(async (req, res, next) => {
    const { name, email, role } = req.body;
    const userData = { name, email, role };

    await userDB.findByIdAndUpdate(req.params.id, userData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await userDB.findById(req.params.id);
    if (!user) {
        next(new ErrorHandler(`no user found with id: ${req.params.id}`, 400));
    }
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();
    res.status(200).json({
        success: true,
        message: "user deleted successfully",
    });
});
