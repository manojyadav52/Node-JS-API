const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    gender:{
        type:String,
        enum:["male","female"],
    },
    profilePicture: { 
        type: String,
        default:null,
     },
    resetToken: { 
        type: String, 
        default: null,
    }, 
    resetTokenExpiry: { 
        type: Date, 
        default: null,
     },
});


// conver the password in hash formated 
userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
});


const User = mongoose.model('User',userSchema);

// exports the user
module.exports = User;

