const Users = require("../model/users");
const bcrypt = require("bcryptjs");
const signJwt = require("../utils/signJwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const AppError = require("../utils/AppError");
const {
  validateUserSignup,
  validateUserLogin,
} = require("../validation/userValidation");

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

const verifyEmailAddress = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.params;

    if (!email || !verificationToken) {
      throw new AppError("Provide email and token");
    }

    //check if user email exist

    const user = await Users.findOne({ email });

    if (!user) {
      throw new AppError("User not found");
    }

    const tokenValid = await bcrypt.compare(
      verificationToken,
      user.verification_token,
    );

    if (!tokenValid) {
      throw new AppError("Failed to verify user - invalid token");
    }

    user.email_verified = true;

    await user.save();

    res.status(201).json({
      status: "successful",
      message: "User verified successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const loginValidation = validateUserLogin(req.body);

    if (loginValidation?.error) {
      throw new AppError(loginValidation?.error.message, 400);
    }

    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Invalid Email or Password");
    }

    //check if user exist
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("User not found!", 404);
    }

    //check if user email is verified
    if (!user.email_verified) {
      throw new AppError("Kindly verify email", 401);
    }

    //check is user password matches the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid login Credentails");
    }

    //check for user token
    const token = signJwt(user._id);

    res.status(200).json({
      status: "success",
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

//forgot-password


const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError("Please provide email address", 404);
    }

    // check if user with the email exist
    const user = await Users.findOne({ email });
    if (!user) {
      throw new AppError("User with the email not found", 404);
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${email}/${resetToken}`;

    // Create reset message
    const resetMessage = `Please click on the link below to reset your password. \n ${resetUrl} `;

    // Reset mail options
    const resetMailOptions = {
      email: email,
      subject: "Reset your password",
      message: resetMessage,
    };

    // Send reset mail
    await sendEmail(resetMailOptions);

    // Update user record with hashed reset token
    user.reset_password_token = hashedResetToken;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    if (!email || !resetToken || !password || !confirmPassword) {
      throw new AppError("Please provide all required fields", 404);
    }

    // check if user with the email exist
    const user = await Users.findOne({ email });
    if (!user) {
      throw new AppError("User with the email not found", 404);
    }

    // Check if the reset token is valid
    const tokenValid = await bcrypt.compare(
      resetToken,
      user.reset_password_token
    );

    if (!tokenValid) {
      throw new AppError("Invalid password reset token", 404);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user record with new password
    user.password = hashedPassword;
    user.reset_password_token = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = {
  signUp,
  verifyEmailAddress,
  login,
  forgotPassword,
  resetPassword
};
