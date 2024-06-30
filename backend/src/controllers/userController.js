const express = require('express');
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const upload = require('../middlewares/upload'); // Import the multer upload middleware

const router = express.Router();

// Middleware to validate JWT
const validateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// Register a new user
const signupUser = (upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'images', maxCount: 5 },
  { name: 'reels', maxCount: 3 }
]), async (req, res) => {
  try {
    const { email, password, confirmPassword, ...otherDetails } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already in use' });
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.profilePicture) {
        otherDetails.profilePicture = req.files.profilePicture[0].path;
      }
      if (req.files.images) {
        otherDetails.images = req.files.images.map(file => file.path);
      }
      if (req.files.reels) {
        otherDetails.reels = req.files.reels.map(file => file.path);
      }
    }

    const newUser = new User({ email, password, ...otherDetails });
    await newUser.save();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Login user
const loginUser = (async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.header('Authorization', `Bearer ${token}`).send({ token, user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Fetch user profile
router.get('/profile', validateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = { signupUser , loginUser};
