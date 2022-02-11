const mongoose = require("mongoose");
const validator = require("validator"); //to check if email format is correct
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const catchAsyncError = require("../middleware/catchAsyncError");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name"],
        minLength: [4, "please enter full name"],
        maxLength: [30, "name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "please enter email"],
        unique: true,
        validate: [validator.isEmail, "enter valid email"],
    },
    password: {
        type: String,
        required: [true, "please enter password"],
        select: false,
        minLength: [8, "password should be 8 characters"],
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        default: "user",
    },
    resetPassswordToken: String,
    resetPasswordDate: Date,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs.hash(this.password, 10); //hashed password
});
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        //generate a unique key for user
        expiresIn: process.env.JWT_EXPIRE,
    });
};
userSchema.methods.comparePassword = function (password) {
    return bcryptjs.compare(password, this.password);
};
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex"); //click link to reset password
    this.resetPassswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordDate = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = new mongoose.model("user", userSchema);
