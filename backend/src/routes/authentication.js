const express = require('express');
const passport = require('passport');
const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';


// Login with google
router.get('/login/federated/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Redirect the user to the Google authentication page
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google will redirect the user to this URL after authentication
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('User authenticated:', req.user);
   res.redirect(`${FRONTEND_URL}`); // Redirect to the frontend server
  }
);

// Handle logout and redirect to the frontend server's home page
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('http://localhost:5173/'); // Redirect to the frontend server's home page
  });
});

module.exports = router;
