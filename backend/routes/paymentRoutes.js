const express = require("express");
const {
    processPayment,
    sendStripeApiKey,
} = require("../controllers/paymentController");
const { userAuthentication } = require("../middleware/auth");
const router = express.Router();

router.route("/payment/process").post(userAuthentication, processPayment);
router.route("/stripeapikey").get(userAuthentication, sendStripeApiKey);

module.exports = router;
