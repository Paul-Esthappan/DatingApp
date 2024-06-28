const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); // Ensure the correct path

//@desc POST new user registration
//@route POST /api/signup
//@access public
const postCreateDetails = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      phoneNumber,
      dob,
      gender,
      country,
      image,
      designation,
      qualification
    } = req.body;

    // Validate required fields
    if (!userName || !email || !password || !phoneNumber || !dob || !gender || !country || !designation || !qualification) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if the userName is taken
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if the phoneNumber is taken
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res.status(400).json({ message: "Phone Number already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phoneNumber,
      dob,
      gender,
      country,
      image,
      designation,
      qualification
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Remove password from the user object
    const userWithoutPassword = {
      _id: savedUser._id,
      userName: savedUser.userName,
      email: savedUser.email,
      phoneNumber: savedUser.phoneNumber,
      dob: savedUser.dob,
      gender: savedUser.gender,
      country: savedUser.country,
      image: savedUser.image,
      designation: savedUser.designation,
      createDate: savedUser.createDate,
      qualification: savedUser.qualification
    };

    // Sign the JWT token
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
      console.error("JWT secret key not found");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const token = jwt.sign(userWithoutPassword, JWT_SECRET_KEY, { expiresIn: '1d' });
    res.status(200).json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error("Error occurred:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `Duplicate key error: ${field} already exists` });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//@desc User login
//@route POST /api/signin
//@access public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email or Password is invalid" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is invalid" });
    }

    // Remove password from the user object
    const userWithoutPassword = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dob: user.dob,
      gender: user.gender,
      country: user.country,
      image: user.image,
      designation: user.designation,
      createDate: user.createDate,
      qualification: user.qualification
    };

    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
      console.error("JWT secret key not found");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const token = jwt.sign(userWithoutPassword, JWT_SECRET_KEY, { expiresIn: '1d' });
    res.status(200).json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { postCreateDetails, loginUser };
