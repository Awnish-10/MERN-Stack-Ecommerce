const OrderDB = require("../models/orderModel");
const ProductDB = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.createNewOrder = catchAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        orderStatus,
    } = req.body;

    const order = await OrderDB.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        orderStatus,
        payedAt: Date.now(),
        user: req.user.id,
    });
    res.status(201).json({
        success: true,
        order,
    });
});

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await OrderDB.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(
            new ErrorHandler("no order found with given order id", 404)
        );
    }
    res.status(200).json({
        success: true,
        order,
    });
});
exports.getAllOrdersForAUser = catchAsyncError(async (req, res, next) => {
    const orders = await OrderDB.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders,
    });
});

exports.getAllOrdersForAdmin = catchAsyncError(async (req, res, next) => {
    const orders = await OrderDB.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
});

exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await OrderDB.findById(req.params.id);
    if (!order) {
        return next(
            new ErrorHandler("no order found with given order id", 404)
        );
    }
    if (order.orderStatus === "delivered") {
        return next(new ErrorHandler("order already delivered", 400));
    }
    order.orderItems.forEach(async (order) => {
        updateStock(order.product, order.quantity);
    });
    order.orderStatus = req.body.status;
    if (req.body.status === "delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        order,
    });
});
const updateStock = async (id, quantity) => {
    const product = await ProductDB.findById(id);
    if (!product) {
        return new ErrorHandler(
            "Some Product in this order no longer exists",
            404
        );
    }
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
};

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await OrderDB.findById(req.params.id);
    if (!order) {
        return next(
            new ErrorHandler("no order found with given order id", 404)
        );
    }
    await order.remove();
    res.status(200).json({
        success: true,
        message: "order deleted successfully",
    });
});
