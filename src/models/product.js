const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{type:String , required:true},
    description:{type:String },
    price:{type:Number , required:true},
    category:{type:String , required:true},
    stock:{type:String , required:true},
    vendor:{type:mongoose.Schema.Types.ObjectId , ref:'Vendor' , required:true},
    images:[{type:String}]
},{
    timeStamps:true
})

module.exports = mongoose.model('Product' , productSchema)