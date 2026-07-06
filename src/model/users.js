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
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    email_verified: {
        type: Boolean,
        default: false,
    },

    verification_token: {
        type: String
    }



});

userSchema.methods.getFullName = function(){
    return `${this.firstname} ${this.lastname}`
}

const Users = mongoose.model("Users", userSchema)

module.exports = Users;