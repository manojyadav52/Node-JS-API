
const jwt = require('jsonwebtoken');
const User = require('./../Model/jwtUserModel');
const SECRETE_KEY ='baskarPagaliRulayegiKya';
const bcrypt = require('bcrypt');

//Register
const register = async (req,res)=>{
        try{
            const getData = new User(req.body);
            console.log(req.body);
            if(!getData){
                return res.status(400).json({
                    message:"Please enter the valid Data",
                    status:false,
                    error:error.message,
                }) 
            }
            await getData.save();
            const token = await jwt.sign({id:getData._id,email:getData.email,phone:getData.phone},SECRETE_KEY, { expiresIn: '1h' });

            res.status(200).json({
                message:"User Register SuccessFully",
                status:true,
                data:getData,
                token,
            })
        }catch(error){
            console.error(error);
            res.json({
                message:"internal Server Issue",
                staus:false,
                error:error.message,
            })
        }
};

// middleWere
const middleWere = async (req,res,next)=>{
                const token =req.header('Authorization')?.split(' ')[1];
                if(!token) return res.json({message:"access denied there is not token provoided", status:false});
        try{
            
            const veryfyToken = jwt.verify(token, SECRETE_KEY);
            const userData = await User.findById(veryfyToken.id);
            console.log(userData);
            if(!userData) return res.json({message:"User Not Found",status:false})
            
                // attach user to the request object
            req.userData= userData;   
            next() //process the next middleware route
        }catch(error){
            console.error(error);
            return res.json({
                message:"Internal Serve Issue",
                status:false,
                data:null,
            })
        }
}





// Login
const login = async (req,res)=>{
    const {email,password} =req.body;
    if(!email || !password) return res.json({message:"email and pasword not exits "});

    try{
        const getData = await User.findOne({email});
        if(!getData) return res.status(400).json({message:"user not found please reEnter",status:false});
        // isValidPassword
        const isValidPassword = await bcrypt.compare(password,getData.password);
        if(!isValidPassword) return res.json({message:"please ReEnter ther password",status:false});
        const token = await jwt.sign({id:getData._id,email:getData.email,phone:getData.phone},SECRETE_KEY, { expiresIn: '1h' })

        if(isValidPassword){
            return res.status(200).json({
                message:'user Login SuccessFully',
                status:true,
                data:getData,
                token,
            })
        }
    }catch(error){
        console.error(error);
        return res.json({
            message:"Internal Server Issue",
            status:false,

        })
    }
}





// exports the all query methods 
module.exports ={
    register,
    login,
    middleWere,
}