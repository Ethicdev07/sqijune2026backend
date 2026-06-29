const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstname:  {
        type: String,
        required: [true, "Please provide a first name"],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, "Please provide a last name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: [true, "Email must be unique"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please provide a first name"],
        minlength: [8, "Password must be at least 8 characters"],
        trim: true,
        select: false
    },
    profile_image :{
        type: String
    }



})


module.exports = Users;