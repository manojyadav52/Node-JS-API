const  mongoose =require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address',
        },
        
    },
    password:{
        type:String,
        required:true,
        min:3,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        minlength: 10,
        validate: {
            validator: (value) => validator.isMobilePhone(value, 'any'), // Allows phone numbers from all countries
            message: 'Invalid phone number',
        },
    },
    gender:{
        type:String,
        enum:["male","female"],
    },
    status:{
        type:String,
        value:['true','false'],
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


// prdefined function before the saving password convert the hasing formate 
userSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        this.password =  await bcrypt.hash(this.password,10);
    }
    next();    
});


// created model 
const User = mongoose.model('User',userSchema);
module.exports = User;