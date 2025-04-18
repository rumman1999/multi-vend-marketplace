const mongoose = require("mongoose");
require("dotenv").config();

//connecting the db here
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MOngodb connection established");
  } catch (error) {
    console.log("error in connection " , error)
    process.emit(1);
  }
};

module.exports = connectDB;
