const Users = require("../model/users");
const bcrypt = require("bcryptjs");
const signJwt = require("../utils/signJwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const AppError = require("../utils/AppError");
const { validateUserSignup } = require("../validation/userValidation");

const signUp = async (req, res, next) => {
  try {
    const validation = validateUserSignup(req.body);

    if (validation?.error) {
      throw new AppError(validation?.error.message, 400);
    }

    const { firstname, lastname, email, password } = req.body;

    //check if user already exist

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      throw new AppError("User with email already exist");
    }

    //Hashing of password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(hashedPassword);

    //create Users

    const user = await Users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new AppError("Failed to create user account");
    }

    // ----send email----verification--

    const options = {
      email: email,
      subject: "Welcome to SQIEcommerce, where products price gets better",
      message:
        "Welcome Onboard. We're pleased to have you. Please keep your eyes peeled for the verification link which you will recieve soon. \n Shop and spend your money",
    };

    await sendEmail(options);

    // -----create verificationtoken-----

    const verificationToken = crypto.randomBytes(32).toString("hex");

    //HASH VERIFICATION TOKEN
    const hashedVerificationToken = await bcrypt.hash(verificationToken, salt);

    // ---create veriificationURL---

    const verificationUrl = `${req.protocol}://${req.get(
      "host",
    )}/api/v1/auth/verify/${user.email}/${verificationToken}`;

    //Create verification message

    const verificationMessage = `Please click on the verification link to verify your email. \n ${verificationUrl}`;

    const verificationMailOptions = {
      email: email,
      subject: "verify your email address",
      message: verificationMessage,
    };

    await sendEmail(verificationMailOptions);

    user.verification_token = hashedVerificationToken;

    await user.save();

    const token = signJwt(user._id);

    res.status(201).json({
      status: "sucess",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
};

const verifyEmailAddress = async(req, res, next)=>{
  try {

    const {email, verificationToken} = req.params;

    if(!email || !verificationToken){
      throw new AppError("Provide email and token")
    };

    //check if user email exist

    const user = await Users.findOne({ email });

    if(!user){
      throw new AppError("User not found");
      
    };


    const tokenValid = await bcrypt.compare(
       verificationToken,
      user.verification_token
    )

    if(!tokenValid){
      throw new AppError("Failed to verify user - invalid token");
    };

    user.email_verified = true;


    await user.save()

    res.status(201).json({
      status: "successful",
      message: "User verified successfully",
      data: {
        user
      }
    });

    
  } catch (error) {
    next(error);
    res.status(404).json({
      status: "Failed",
      message: error.message
    })
  }
};



module.exports = {
  signUp,
  verifyEmailAddress
};
