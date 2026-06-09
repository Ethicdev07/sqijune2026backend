require('dotenv').config()
const app  = require('./app.js');

const port = process.env.PORT || 5000;

console.log(port);




app.listen(port, ()=>{
    console.log(`server is runing on port ${port}`);
});