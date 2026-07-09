const AppError = require("./../utils/AppError");
const { dataUri } = require("./../utils/multer");
const { uploader } = require("./../utils/cloudinary");
const { validateProduct } = require("./../validation/productValidation");
const Products = require("./../model/products");
const Users = require("./../model/users");

const createNewProduct = async (req, res, next) => {
  try {
    const validation = validateProduct(req.body);

    if (validation?.error) {
      throw new AppError(validation?.error.message, 400);
    }

    const file = req.file;
    if (!file) {
      throw new AppError("Please upload an image", 400);
    }

    const imageData = dataUri(file).content;
    const result = await uploader.upload(imageData, {
      folder: "Sqiproductstore/image",
    });

    const user = await Users.findById(req.user._id);

    if (!user) {
      throw new AppError("user does not exist", 404);
    }

    const userId = user._id;

    const { title, description, price, stock, instock } = req.body;
    console.log(title);

    const newProduct = await Products.create({
      title,
      description,
      price,
      stock,
      instock,
      image: result.secure_url,
      user: userId,
    });

    if (!newProduct) {
      throw new AppError("An error occured while creating product", 403);
    }

    // newProduct.save()

    res.status(200).json({
      status: "successful",
      message: "product created successfully",
      data: {
        newProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Products.find().populate("user");

    if (!products) {
      throw new AppError("Unable to retrieve product", 404);
    }

    res.status(200).json({
      status: "succesful",
      message: "All products fetched succesfully",
      result: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProductDetails = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);
    if (!product) {
      throw new AppError(`Product with ${productId} not found`, 404);
    }
    res.status(200).json({
      status: "success",
      message: "product fetched successfuly",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);
    if (!product) {
      throw new AppError(`Product with ${productId} not found`, 404);
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError("No update data provided", 400);
    }

    const allowedFields = ["title", "description", "price", "stock", "instock"];
    const fieldsToUpdate = Object.keys(req.body);
    fieldsToUpdate.forEach((field) => {
      if (allowedFields.includes(field)) {
        product[field] = req.body[field];
      } else {
        throw new AppError(`Field ${field} is not allowed`, 403);
      }
    });

    await product.save();

    res.status(200).json({
      status: "success",
      message: "profile updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);

    const currentUserId = req.user._id;

    if (!product) {
      throw new AppError(`Product with ${productId} not found`, 404);
    }

    if (product.user.toString() !== currentUserId.toString()) {
      throw new AppError("You do not have permission to delete this product", 403);
    }

      await product.deleteOne();

    

    res.status(200).json({
      status: "successful",
      message: "Product deleted succesfully",
    });
  } catch (error) {
    next(error);
  }
};
//getproductdetail
//deleteproduct
//updateproductdetail

module.exports = {
  createNewProduct,
  getAllProducts,
  getProductDetails,
  deleteProduct,
  updateProduct,
};
