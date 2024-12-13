const express = require('express');
const mongoose = require('mongoose');
const router = require('./JWT/router/jwtUserRouter');
const app = express();
const PORT =8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));

// connect the database mongoose 
mongoose.connect('mongodb://localhost:27017/pro3-jwt',
{useNewUrlParser: true, useUnifiedTopology:true});


app.use('/api',router);



// server created 
app.listen(PORT,(req,res)=>console.log(`The Server Will Be Listening ${PORT}`));