const express = require('express');
const {postCreateDetails, loginuser}  = require('../controllers/auth-controller');
const router = express.Router();

// router.post('/login',authController.login);

//CREATE USER
router.post('/signup',postCreateDetails)
//SIGN IN
router.post('/login', loginuser)

module.exports = router;
