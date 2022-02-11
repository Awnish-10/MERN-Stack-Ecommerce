const express = require("express");
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct,
    addReview,
    deleteReview,
    getProductReviews,
    getAdminProducts,
} = require("../controllers/productControllers");
const { userAuthentication, authorizedRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);
router
    .route("/admin/products")
    .get(userAuthentication, authorizedRoles("admin"), getAdminProducts);

router
    .route("/admin/product/new")
    .post(userAuthentication, authorizedRoles("admin"), createProduct);

router
    .route("/admin/product/:id")
    .put(userAuthentication, authorizedRoles("admin"), updateProduct)
    .delete(userAuthentication, authorizedRoles("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);

router
    .route("/review")
    .put(userAuthentication, addReview)
    .delete(userAuthentication, authorizedRoles("admin"), deleteReview)
    .get(getProductReviews);

module.exports = router;
