const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; //internal server error
    err.message = err.message || "internal server error";

    if (err.name === "CastError") {
        const message = `resource not found , invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
        const message = `Dublicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokkenError") {
        const message = `invalid JWT token, please try again`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokkenExpiredErroe") {
        const message = `JWT token expired, please try again`;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
