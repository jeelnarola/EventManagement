const User = require("../../models/Auth/user.schema");
const generateTokenAndCookieSet = require("../../utils/generateTokenAndCookieSet");

const Register =async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({success:false,message:"All Fields Are Required"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({success:false,message:"Invalid Email"});
        }

        if (password.length < 6){
            return res.status(400).json({success:false,message:"Password must be at least 6 characters"});
        }

        let ExtisUser = await User.findOne({email:email});
        if(ExtisUser){
            return res.status(400).json({success:false,message:"Email already exists"});
        }
        const NewUser = new User({
            username,
            email,
            password,
            role:'User'
        })
        generateTokenAndCookieSet(NewUser._id,res)
        await NewUser.save()
        res.status(201).json({success:true,user:{
            ...NewUser._doc,
            password:""
        }})
    } catch (error) {
        console.log("Error in Register controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}

const Login = async(req,res) =>{
    try {
        let {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({success:false,message:"All Fields Are Required"});
        }

        let ExtisUser = await User.findOne({email:email});
        if(ExtisUser == null){
            return res.status(400).json({success:false,message:"Email Is Not Match!"});
        }
        let isMatchPassword = await ExtisUser.comperPassword(password)
        console.log(isMatchPassword)
        if(isMatchPassword){
            generateTokenAndCookieSet(ExtisUser._id,res)
            res.status(201).json({success:true,user:{
                ...ExtisUser._doc,
                password:""
            }})
        }else{
            res.status(400).json({success:false,message:"Password Is Not Match!"});
        }
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}

const Logout = async(req,res) => {
    try {
        res.clearCookie('jwt-RecipeManagement');
        res.status(201).json({success:true,message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in Logout controller", error.message);
        res.status(500).json({success:false,message:"Interna; Server Error"});
    }
}

module.exports = {Register,Login,Logout}