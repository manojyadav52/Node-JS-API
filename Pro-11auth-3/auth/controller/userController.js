const express = require('express');
const User = require('./../modules/userModules');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { error } = require('console');

exports.register = async (req, res) => {
    try {
        const userData = new User(req.body);
        if(!userData){
            res.status(400).json({
                status: false,
                message: 'Validation error',
                data: null
            });
        }
        await userData.save();
        res.status(201).json({
            status: true,
            message: 'Register successfully',
            data: userData
        });
        
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error,
            data: null
        });
    }

}



// login
exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const getData = await User.findOne({ email });
        if (!getData) return res.status(404).json({ 
            message: "Invalid user" ,
            status:false,
            data:null,
            message:error,
        });

        //   password verification 
        const validPassword = await bcrypt.compare(password, getData.password);
        // const data =await bcrypt.hash(password,10);
        // // console.log(data);
        // console.log(getData.password);
        // console.log(validPassword);
        if (validPassword) {
            return res.status(200).json({
                status:true,
                message: "User LogIn Successfully",
                data: getData,
            })
        } else {
            return res.status(404).json({
                 status:false,
                 data:null,
                 message:"password inCorrect please enter the valid password",
                });
        }
    } catch (error) {
        console.error("Error durinig the login", error.message);
        res.status(500).json({ 
            error: "Interanl Server Issue", error:error.message,
            status:false,
            data:null,
        });
    }
};


// forgate Password
// const SECKRET_KEY = "dev";
exports.forgatePassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ 
            message: 'Invalid Email ID',
            data:null,
            
        });

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

        // Save the token and expiry to the user document
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "1cba1f601987a3", // Replace with your Mailtrap user
                pass: "9e9a61ae08fdf1"  // Replace with your Mailtrap password
            }
        });

        // Email options
        const resetLink = `http://localhost:8082/api/forget/${resetToken}`;
        const mailOptions = {
            from: 'manojyadav1052000@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
             message: 'password token generated & sent your email ',
             data: email ,
             status:true,
            });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            message: 'Error Internal Server  Issue',
            error: error.message ,
            status:false,
            data:null,
        });
    }


    //   try{
    //         const getData = await User.findOne({email});
    //         if(!getData) return res.json({message:"please Enter the Valid Email & password"});

    //         // token generate jwt token
    //         const resetToken = jwt.sign(
    //             {id:getData._id},
    //             SECKRET_KEY,
    //             {expiresIn:'1h'}
    //         );
    //         // save the token & expair the token 
    //         getData.resetToken = resetToken;
    //         getData.resetTokenExpiry= Date.now() + 3600000;
    //        await getData.save();

    //         // create the link 
    //         // const resetLink = `http://localhost:${PORT}/reset-password?token=${resetToken}`;
    //         // console.log(`Password reset link: ${resetLink}`);

    //         const transporter = nodemailer.createTransport({
    //             host: "sandbox.smtp.mailtrap.io",
    //             port: 2525,
    //             auth: {
    //                 user: "1cba1f601987a3", // Replace with your Mailtrap user
    //                 pass: "9e9a61ae08fdf1"  // Replace with your Mailtrap password
    //             }
    //         });

    //         // Email options
    //         const resetLink = `http://localhost:8082/api/reset-password/${resetToken}`;
    //         const mailOptions = {
    //             from: 'no-reply@gmail.com',
    //             to: email,
    //             subject: 'Password Reset',
    //             html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    //         };
    //         // sent the email
    //         await transporter.sendMail(mailOptions);
    //         res.status(200).json({message:"password reset and sent email",data:email});
    //   }catch(error){
    //       console.error('error',error.message);
    //       res.status(500).json({error:"error processing request", error:error.message});
    //   }
};

// reset
exports.reset = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long',
                status:false,
                data:null,
            });
        }

        // Find user by reset token and check token expiry
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(hashedPassword);
        const user = await User.findOneAndUpdate({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
        }, { 
            password: hashedPassword,
            resetToken:null,
            resetTokenExpiry:null,
        });

        if (!user) return res.status(400).json({ 
            message: 'Invalid or expired token' ,
            status:false,
            data:null,
        });

        res.status(200).json({
             message: 'Password reset successfully',
             status:true,
             data:user,
            });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).json({ 
            message: 'Error resetting password', error: error.message ,
            status:false,
            data:null
        });
    }

};

// change
exports.change = async (req, res) => {
    const { email, password, newPassword } = req.body;
    if (!email || !password || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ 
            message: "please Enter the valid email,password & newPassword ,& length must be greter then 6",
            error:error.message,
            status:false,
            data:null,
         });
    }

    try {
        const userData = await User.findOne({ email });
        if (!userData) return res.status(404).json({ 
            message: "invalid user and password",
            status:false,
            data:null,
            error:error.message,
        });

        //   isValid old password
        const isValidPassword = await bcrypt.compare(password, userData.password);
        if (!isValidPassword) return res.status(404).json({ 
            message: "old password incorrect",
            status:false,
            data:null,
            error:error.message,
        });


        // changed the newPassword in has formate 
        const hashnewPassword = await bcrypt.hash(newPassword, 10);
        const updateUser = await User.findOneAndUpdate({email},{$set:{password:hashnewPassword}},{new:true});
        console.log(updateUser);
        if(updateUser){
            return res.status(200).json({
                message:"new Password Update SuccessFully",
                Data:updateUser,
                status:true,
            })
        }else{
            res.status(404).json({
                error:"invalid please try again",
                status:false,
                data:null,
                error:error.message,
            });
        }
     
    } catch (error) {
        console.error("error changing password error is", error.message);
        res.status(500).json({
            error:"Internal Server issue",
            error:error.message,
            status:false,
            data:null,
        });
    }
};