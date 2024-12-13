const express = require('express');
const { register, login, forgatePassword, reset, change } = require('../controller/userController');
const router = express.Router();


router.post('/register',register);
router.post('/login',login);
router.post('/forget',forgatePassword);
router.post('/reset/:token',reset);
router.patch('/change',change);

// exports the router 
module.exports = router;