const express = require("express");
const {
    createNewOrder,
    getSingleOrder,
    getAllOrdersForAUser,
    updateOrder,
    deleteOrder,
} = require("../controllers/orderController");
const { userAuthentication, authorizedRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(userAuthentication, createNewOrder);
router.route("/order/:id").get(userAuthentication, getSingleOrder);
router.route("/orders/me").get(userAuthentication, getAllOrdersForAUser);
router
    .route("/admin/orders")
    .get(userAuthentication, authorizedRoles("admin"), getAllOrdersForAUser);
router
    .route("/admin/order/:id")
    .put(userAuthentication, authorizedRoles("admin"), updateOrder)
    .delete(userAuthentication, authorizedRoles("admin"), deleteOrder);

module.exports = router;
