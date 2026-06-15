require('dotenv').config()
const app  = require('./app.js');

const port = process.env.PORT || 5000;

const connectDB = require("./src/config/db.js");

console.log(port);


connectDB();

app.listen(port, ()=>{
    console.log(`server is runing on port ${port}`);
});