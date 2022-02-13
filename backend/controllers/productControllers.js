const ProductDB = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.getAllProducts = catchAsyncError(async (req, res) => {
    const productCount = await ProductDB.countDocuments();
    const countPerPage = 4;
    const forFilteredProductCount = new ApiFeatures(ProductDB.find(), req.query)
        .search()
        .filter();
    let filteredProductsCount = await forFilteredProductCount.query;
    filteredProductsCount = filteredProductsCount.length;
    const apiFeature = new ApiFeatures(ProductDB.find(), req.query) //req.query -> an object with key value pair
        .search()
        .filter()
        .pagination(countPerPage);
    const products = await apiFeature.query;
    // console.log("filtered", apiFeature);

    // // console.log("apiFeatures", apiFeature);

    // apiFeature.model.pagination(countPerPage);
    // // console.log("products", products);
    res.status(200).json({
        success: true,
        products,
        productCount,
        countPerPage,
        filteredProductsCount,
    });
});
// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await ProductDB.find();

    res.status(200).json({
        success: true,
        products,
    });
});
exports.createProduct = catchAsyncError(async (req, res) => {
    req.body.user = req.user.id;
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    console.log("in");
    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await ProductDB.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await ProductDB.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }
    // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }

    product = await ProductDB.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        product,
    });
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await ProductDB.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "product deleted successfully",
    });
});
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await ProductDB.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});

exports.addReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    console.log("userid", req.user.id);
    const userId = req.user.id;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await ProductDB.findById(productId);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }
    const isReviewed = product.reviews.find((item) => {
        return item.user.toString() === req.user.id.toString();
    });
    console.log("reviewed");
    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user.id.toString()) {
                review.rating = rating;
                review.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);

        product.numberOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((review) => {
        avg += review.rating;
    });
    product.ratings = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "review added",
    });
});

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await ProductDB.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await ProductDB.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;
    console.log("djik");
    await ProductDB.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
        message: "review deleted",
    });
});
