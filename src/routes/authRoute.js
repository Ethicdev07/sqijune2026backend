const express = require("express");
const authController = require("./../controllers/authController.js");

const router = express.Router();

router.post("/signup", authController.signUp);
router.get("/users", authController.getAllUsers)



module.exports = router;