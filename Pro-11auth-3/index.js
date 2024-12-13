const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 8082;
const routerData = require('./auth/router/userRouter');

app.use(express.json());
app.use(express.urlencoded({extended:true}));


// connect the mongoose 
mongoose.connect('mongodb://localhost:27017/auth-three',
{useNewUrlParser: true, useUnifiedTopology:true});


// secret_Key
const SECKRET_KEY ="manoj.dev";

app.use('/api',routerData);


app.listen(PORT,(req,res)=>console.log(`server will be listening the ${PORT}`));



