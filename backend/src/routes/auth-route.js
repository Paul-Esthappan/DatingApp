const express = require('express');
const router = express.Router();
const { postCreateDetails, loginUser } = require('../controllers/authController');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');


// Signup route
router.post('/signup', postCreateDetails);

// Login route
router.post('/signin', loginUser);

// Login with google
router.get('/login/federated/google', passport.authenticate('google'));

module.exports = router;
