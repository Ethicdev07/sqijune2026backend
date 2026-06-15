const mongoose = require("mongoose");

const mongo_password = process.env.MONGO_PASSWORD
const mongo_url = process.env.MONGO_URL.replace("<password>", mongo_password);

const connectDB = async()=>{
    mongoose.connect(mongo_url).then(()=>{
        console.log(`Databse connected successfully`);
        
    }).catch((error)=>{
        console.log(`an error occured while connecting to database`, error);
        
    })
};


module.exports = connectDB;