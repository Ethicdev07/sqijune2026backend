const express = require("express");

const cors = require("cors");
const app = express();


app.use(express.json());

app.use(express.urlencoded({extended: true}))

app.use(cors("*"));


//we have different http methods

//get-- read data
//post-- create date
//patch/put --update
//delete--delete

app.get("/", (req, res)=>{
    res.status(200).json({
        status: 'successful',
        message: 'welcome to sqi ecommerce'
    })
});

app.get("/api/v1", (req, res)=>{
    res.status(200).json({
        status: 'successful',
        message: "welcome to sqi Ecommerce API"
    })
})

module.exports = app;


