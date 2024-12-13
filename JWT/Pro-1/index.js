const express = require('express');
const mongoose = require('mongoose');
const jwtDecode = require('jwt-decode');
const app = express();
const PORT =8080;


const token ="node";
const decode = jwtDecode(token);
console.log(decode);


const decodedHeader = jwtDecode(token, { header: true });
console.log(decodedHeader);



app.listen(PORT,(req,res)=>console.log(`Server will be listening the ${PORT}`));