const jwt = require("jsonwebtoken");
const UserDB = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");

exports.userAuthentication = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("please login to view products", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserDB.findById(decodedData.id);
    next();
});

exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `role: ${req.user.role} cannot access these resources`,
                    403
                )
            );
        }
        next();
    };
};
