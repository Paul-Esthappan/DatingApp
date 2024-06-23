// const login=async(req,res)=>{

//     const { username, password } = req.body;

//     console.log(req.body)
    
//     if (username === 'learnbuds' && password === 'learnbuds') {
//         res.json({ success: true });
//     } else {
//         res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }


// }

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/userSchema");

//@dec POST new data
//@route POST /api/signup
//@access public
const postCreateDetails = async (req, res) => {
  try {
    const { userName, email, password, phoneNumber, dob, gender, country, image, designation, createDate, qualification } = req.body;
    
  
    // Check if all required fields are provided
    if (!userName || !email || !password || !phoneNumber || !dob || !gender || !country || !designation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists by email
    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return res.status(400).json({ message: "User already exists" });
    }
   

    // Check if the userName is already taken
    const isExistUserName = await User.findOne({ userName });
    if (isExistUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // Check if the phoneNumber is already taken
    const isExistPhoneNumber = await User.findOne({ phoneNumber });
    if (isExistPhoneNumber) {
      return res.status(400).json({ message: "Phone Number already exists" });
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const userDetails = new User({
      userName,
      email,
      phoneNumber,
      dob,
      gender,
      country,
      image,
      password: hashedPassword,
      designation,
      createDate,
      qualification,
    });

    // Save the user to the database
    const savedUser = await userDetails.save();

    // Create the user object without the password
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
      qualification:savedUser.qualification,
    };

    // Get the JWT secret key
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
      console.error("JWT secret key not found");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Sign the JWT token
    jwt.sign(userWithoutPassword, JWT_SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        console.error("Error signing JWT:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      } 
      return res.status(200).json({ user: userWithoutPassword, token });
    });
    
    // return res.status(200).json({message:"user registred"})
  } catch (error) {
    console.error("Error occurred:", error);
    // Handle duplicate key errors separately
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `Duplicate key error: ${field} already exists` });
    }
    return res.status(400).json({ message: "Error occurred: " + error.message });
  }
};



//@dec signin with email & psw
//@route POST /api/signin
//@acess public


const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const userdata = await User.findOne({ email });

    if (!userdata) {
      return res.status(401).send("Email or Username is invalid");
    }

    const isPasswordValid = await bcrypt.compare(password, userdata.password);
    console.log("userdatapsw-",userdata.password,"pswws",password,"ispswalid",isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).send("Password is invalid");
    }

    // Exclude password from the user data before sending the response
    const userWithoutPassword = {
      _id: userdata._id,
      userName: userdata.userName,
      email: userdata.email,
      phoneNumber: userdata.phoneNumber,
      dob: userdata.dob,
      gender: userdata.gender,
      country: userdata.country,
      image: userdata.image,
      designation: userdata.designation,
      createDate: userdata.createDate,
      qualification:userdata.qualification,
    };

    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    if (!JWT_SECRET_KEY) {
      console.error("JWT secret key not found");
      return res.status(500).send("Internal Server Error");
    }

    jwt.sign(userWithoutPassword, JWT_SECRET_KEY, { expiresIn: 186400 }, (err, token) => {
      if (err) {
        console.error("Error signing JWT:", err);
        res.status(500).send("Internal Server Error");
      } else {
        // Send the token in the response
        res.status(200).json({ user: userWithoutPassword, token });
        console.log(userWithoutPassword);
      }
    });
  } catch (error) {
    console.error("Error occurred", error);
    res.status(500).send("Internal Server Error");
  }
};


    
module.exports = {  postCreateDetails, loginuser }


module.exports= {login};