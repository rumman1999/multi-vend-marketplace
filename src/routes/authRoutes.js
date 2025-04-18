const express = require("express");
const {register , login } = require("../controllers/authControllers");
const {check ,  validationResult} = require('express-validator');

const router = express.Router();

router.post('/register' , [
    check('name' , 'Name is required').not().isEmpty(),
    check('email' , 'PLease include a valid email').isEmail(),
    check('password' , 'Password must be 6 or more charachter').isLength({min:6})
] , 
async (req , res)=>{
    console.log("first" , req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({
        errors:errors.array()
    });
    register(req , res)
}
)

router.post('/login' , [
    check('email' , 'Please include a valid email').isEmail(),
    check('password' , 'Password is required').exists()
] , async(req , res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({
        errors:errors.array()
    });
    login(req , res)
})

module.exports = router;