
const { createNewProduct, getAllProducts } = require("./../controllers/productController");

const express = require("express");

const authMiddleware = require("./../middleware/auth");

const { imageUploads } = require("./../utils/multer");

const { cloudinaryConfig } = require("./../utils/cloudinary");

const router = express.Router();

router.route("/")
.get(getAllProducts)
.post(authMiddleware.protectRoute, cloudinaryConfig, imageUploads, createNewProduct);

module.exports = router;