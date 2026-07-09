
const { createNewProduct, getAllProducts, getProductDetails, updateProduct, deleteProduct } = require("./../controllers/productController");

const express = require("express");

const authMiddleware = require("./../middleware/auth");

const { imageUploads } = require("./../utils/multer");

const { cloudinaryConfig } = require("./../utils/cloudinary");

const router = express.Router();

router.route("/")
.get(getAllProducts)
.post(authMiddleware.protectRoute, cloudinaryConfig, imageUploads, createNewProduct);

router.route("/:id")
.get(authMiddleware.protectRoute, getProductDetails)
.patch(authMiddleware.protectRoute, updateProduct)
.delete(authMiddleware.protectRoute, deleteProduct);

module.exports = router;