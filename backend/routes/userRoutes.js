const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
} = require("../controllers/userController");
const { userAuthentication, authorizedRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(userAuthentication, getUserDetails);
router.route("/password/update").put(userAuthentication, updatePassword);
router.route("/me/update").put(userAuthentication, updateProfile);
router
    .route("/admin/users")
    .get(userAuthentication, authorizedRoles("admin"), getAllUsers);
router
    .route("/admin/user/:id")
    .get(userAuthentication, authorizedRoles("admin"), getSingleUser)
    .put(userAuthentication, authorizedRoles("admin"), updateUser)
    .delete(userAuthentication, authorizedRoles("admin"), deleteUser);
module.exports = router;
