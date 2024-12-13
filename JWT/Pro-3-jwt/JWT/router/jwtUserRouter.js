const express = require('express');
const router = express.Router();
const {register, login, middleWere }= require('./../controller/jwtUserController');



router.post('/register',register);
router.post('/login',login);
router.get('/veryfyuser',middleWere);



// exports the router 
module.exports = router;



