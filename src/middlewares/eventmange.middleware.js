const jwt = require('jsonwebtoken');
const User = require('../models/Auth/user.schema');
require('dotenv').config({path:'../.env'})
const eventManage = async(req,res,next) =>{
    try {
        const Token = req.cookies["jwt-EventManagment"];
        if(!Token){
            res.status(401).json({success:false,message:"Unauthorized - No Token Provided"})
        }
        const decode = jwt.verify(Token,process.env.JWT_SECRET)
        if(!decode){
            res.status(401).json({success:false,message:"Unauthorized - Invalid Token"})
        } 
        const user = await User.findById(decode.UserId)
        if(!user){
            res.status(404).json({success:false,message:"User Not Found."})
        }
        req.user = user;
        next()
    } catch (error) {
        console.log("Error in eventManage Middlewares", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

module.exports = eventManage