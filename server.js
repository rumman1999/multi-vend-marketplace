const connectDB = require("./src/config/db");
const app = require('./src/app')
require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB();


app.listen(PORT , ()=>{
    console.log("Server is runnning at " , PORT)
})