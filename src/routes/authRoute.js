const express = require("express");

const authController = require(".././controllers/authController");
const router = express.Router();

router.route("/signup").post(authController.signUp);

router.route("/verify/:email/:verificationToken").get(authController.verifyEmailAddress)






module.exports = router;