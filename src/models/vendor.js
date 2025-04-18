const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name : {type : String , required:true},
    email : {type : String , required:true , unique:true},
    password : {type : String , required:true},
    storeName: {type : String , required:true , unique:true},
    phone : {type : String , required:true},
    address : {type : String , required:true},
    isApproved : {type : Boolean , default:false},

},{
    timestamps:true
})

module.exports = mongoose.model('Vendor' , vendorSchema)