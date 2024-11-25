const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    role:{
        type:String,
        require:true
    }
})

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next()
})

UserSchema.methods.comperPassword = async function (Password) {
    try {
        return await bcrypt.compare(Password,this.password)
    } catch (error) {
        console.log("Bcry comper Error :- ")
    }
}

const User = mongoose.model("User",UserSchema)

module.exports = User