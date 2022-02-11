const Mongoose = require("mongoose");
const ProductSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "please enter price"],
        maxLength: [8, "price cannot exceed 8 figures"],
    },
    description: {
        type: String,
        required: [true, "please enter description"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        maxlength: 4,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "please enter product category"],
    },
    reviews: [
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            rating: {
                type: Number,
                required: [true, "please enter number of stars"],
                default: 0,
            },
            comment: {
                type: String,
                required: true,
            },
            user: {
                type: Mongoose.Schema.ObjectId,
                ref: "user",
                required: true,
            },
        },
    ],
    numberOfReviews: {
        type: Number,
    },
    user: {
        type: Mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});
module.exports = new Mongoose.model("products", ProductSchema);
