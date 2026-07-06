const express = require("express");
const authMiddleware = require("./../middleware/auth");
const userController = require("../controllers/userController");

const router = express.Router();


router.route("/").get(userController.getAllUsers);

router.route("/profile").get(authMiddleware.protectRoute, userController.getUserProfile);

module.exports = router;