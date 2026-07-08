const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        unique: [true, "Title must be unique"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "please provide description"]
    },
    price: {
        type: Number,
        required: [true, "Please provide a price"],
        min: [0, "Price must not be less than zero"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    image:{
        type: String,
        required: [true, "kindly upload image"]
    },
   
    stock:{
        type: Number,
        required: [true, "kindly specify the quantity of product available"]
    },
    instock: {
        type: Boolean,
        required: [true, "specify if product is available"],
        default: true,
    }

});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;


