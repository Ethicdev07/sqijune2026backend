const express = require("express");
const cors = require("cors");
const morgan = require("morgan")

const authRoutes = require("./src/routes/authRoute.js");
const userRoutes = require("./src/routes/userRoute.js")
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))

app.use(cors("*"));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "successful",
    message: "welcome to sqi ecommerce",
  });
});

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    status: "successful",
    message: "welcome to sqi Ecommerce API",
  });
});

//endpoint

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes)


module.exports = app;
