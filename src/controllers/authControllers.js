const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


//register a new user 
exports.register = async(req , res)=> {
    const {name , email , password , role} = req.body;

    try{
        //find if user is already register 
        let user = await User.findOne({email});
        if(user) return res.status(400).json({
            message : "User already exists"
        })

        //generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password , salt);

        //create user goes here 
        user = new User({name:name , email:email , password:hashedPass , role:role});
        await user.save();

        res.status(201).json({
            message :'User registered Succesfully'
        })
    }catch(err){
        res.status(500).json({
            message : `Server Error ${err}`
        })
    }
}

exports.login = async(req , res)=>{
    const {email , password} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user) return res.status(404).json({
            message: 'E-mail not registered , please register'
        })

        const isMAtch = await bcrypt.compare(password , user.password);
        if(!isMAtch) return res.status(401).json({
            message:"Invalid credentials"
        })

        const token = jwt.sign({
            id : user._id,
            role : user.role
        }, process.env.JWT_SECRET ,{ expiresIn:'7d'})


        res.status(200).json({
            token , user:{
                id:user._id , role : user.role , name: user.name, email: user.email
            }
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message : "Server Error"
        })
    }
}