const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Interaction = require('../models/interactionSchema');
const { getInteractionDocument } = require('../utils/interactionUtils');

// Signup User
const signupUser = async (req, res) => {
  try {
    const {
      email,
      password,
      displayName,
      shortBio,
      location,
      phoneNumber,
      dob,
      gender,
      designation,
      createDate,
      qualification,
      interests,
      drinkingHabits,
      smokingHabits,
      googleId,
      ...otherDetails
    } = req.body;

    // Check for existing user by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already in use' });
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        otherDetails.image = req.files.image[0].path.replace(/\\/g, '/');
      }
      if (req.files.images) {
        otherDetails.images = req.files.images.map(file => file.path.replace(/\\/g, '/'));
      }
      if (req.files.reels) {
        otherDetails.reels = req.files.reels.map(file => file.path.replace(/\\/g, '/'));
      }
    }


    // Create a dummy random googleId if not provided
    const dummyGoogleId = googleId || uuidv4();

    // Create new user object
    const newUser = new User({
      email,
      password: password,
      displayName,
      shortBio,
      location,
      phoneNumber,
      dob,
      gender,
      designation,
      createDate,
      qualification,
      interests,
      drinkingHabits,
      smokingHabits,
      googleId: dummyGoogleId,
      ...otherDetails
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '48h',
    });

    // Exclude password from user object
    const { password: pwd, ...userWithoutPassword } = newUser.toObject();

    res.status(201).send({ message: 'User registered successfully', token, user: userWithoutPassword });
  } catch (error) {
    console.error('Error in signupUser:', error);
    res.status(500).send({ message: error.message });
  }
};
const loginUser = async (req, res) => {
  console.log('login triggered');
  try {
    const { email, password } = req.body;
    console.log("reqbody", req.body);
    console.log('Login attempt with', email, password);

    const user = await User.findOne({ email });
    console.log("user is", user);
    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }


    
    console.log("compair psw", password , "--", user.password);
        // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '48h',
    });

    const { password: pwd, ...userWithoutPassword } = user.toObject();
    res.header('Authorization', `Bearer ${token}`).send({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).send({ message: error.message });
  }
};


// Fetch User and related interactions
const fetchUser = async (req, res) => {
    console.log('fetchUser triggered');
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Exclude sensitive information like password from user object
        const { password, ...userWithoutPassword } = user.toObject();

        // Fetch interactions related to logged-in user and fetched user
        const loggedInUserId = req.user._id;
        const fetchedUserId = user._id;

        const interaction = await Interaction.findOne({ userId: loggedInUserId });

       const filteredInteractions = {
            
            
       
            messages: interaction.messages.filter(message => message.from.equals(fetchedUserId) || message.to.equals(fetchedUserId)),
        };

        // Combine user and filtered interaction data
        const userWithInteraction = {
            ...userWithoutPassword,
            interaction: filteredInteractions
        };

        res.status(200).send(userWithInteraction);
    } catch (error) {
        console.error('Error in fetchUser:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};


// Fetch Users by Filters
const fetchUsersByFilters = async (req, res) => {
  try {
    const { location, qualification, designation } = req.query;

    // Build query conditions based on provided filters
    const queryConditions = {};
    if (location) {
      queryConditions.location = location;
    }
    if (qualification) {
      queryConditions.qualification = qualification;
    }
    if (designation) {
      queryConditions.designation = designation;
    }

    const users = await User.find(queryConditions);

    if (!users || users.length === 0) {
      return res.status(404).send({ message: 'Users not found with the specified filters' });
    }

    // Exclude password from user objects
    const usersWithoutPassword = users.map(user => {
      const { password: pwd, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });

    res.send(usersWithoutPassword);
  } catch (error) {
    console.error('Error in fetchUsersByFilters:', error);
    res.status(500).send({ message: error.message });
  }
};

const fetchUsersByLocation = async (req, res) => {
  console.log("location fetch");
  try {
    const loggedInUserId = req.user._id;

    const loggedInUser = await User.findById(loggedInUserId);
    console.log("Logged-in user:", loggedInUser);

    if (!loggedInUser) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const { location } = loggedInUser;
    console.log("Logged-in user location:", location);

    if (!location) {
      return res.status(400).send({ message: 'Location not found in user profile' });
    }

    // Get IDs of users with whom the logged-in user has interactions
    const interactionIds = await Interaction.distinct('userId', {
      $or: [
        { userId: loggedInUserId },
        { 'sentRequests.user': loggedInUserId },
        { 'receivedRequests.user': loggedInUserId }
      ]
    });

    const users = await User.aggregate([
      { $match: { _id: { $nin: [...interactionIds, loggedInUser._id] }, location } },
      { $sample: { size: 10 } },
      { $project: { password: 0 } }
    ]);

    console.log("Users in location:", users);

    if (users.length === 0) {
      return res.status(404).send({ message: 'No users found with matching location' });
    }

    res.status(200).send(users);
  } catch (error) {
    console.error('Error in fetchUsersByLocation:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};




const fetchUsersByDesignation = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const loggedInUser = await User.findById(loggedInUserId);
    console.log("Logged-in user:", loggedInUser);

    if (!loggedInUser) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const { designation } = loggedInUser;
    console.log("Logged-in user designation:", designation);

    if (!designation) {
      return res.status(400).send({ message: 'Designation not found in user profile' });
    }

    // Get IDs of users with whom the logged-in user has interactions
    const interactionIds = await Interaction.distinct('userId', {
      $or: [
        { userId: loggedInUserId },
        { 'sentRequests.user': loggedInUserId },
        { 'receivedRequests.user': loggedInUserId }
      ]
    });

    const users = await User.aggregate([
      { $match: { _id: { $nin: [...interactionIds, loggedInUser._id] }, designation } },
      { $sample: { size: 10 } },
      { $project: { password: 0 } }
    ]);

    console.log("Users in designation:", users);

    if (users.length === 0) {
      return res.status(404).send({ message: 'No users found with matching designation' });
    }

    res.status(200).send(users);
  } catch (error) {
    console.error('Error in fetchUsersByDesignation:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};




const fetchUsersByQualification = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const loggedInUser = await User.findById(loggedInUserId);
    console.log("Logged-in user:", loggedInUser);

    if (!loggedInUser) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const { qualification } = loggedInUser;
    console.log("Logged-in user qualification:", qualification);

    if (!qualification) {
      return res.status(400).send({ message: 'Qualification not found in user profile' });
    }

    // Get IDs of users with whom the logged-in user has interactions
    const interactionIds = await Interaction.distinct('userId', {
      $or: [
        { userId: loggedInUserId },
        { 'sentRequests.user': loggedInUserId },
        { 'receivedRequests.user': loggedInUserId }
      ]
    });

    const users = await User.aggregate([
      { $match: { _id: { $nin: [...interactionIds, loggedInUser._id] }, qualification } },
      { $sample: { size: 10 } },
      { $project: { password: 0 } }
    ]);

    console.log("Users with qualification:", users);

    if (users.length === 0) {
      return res.status(404).send({ message: 'No users found with matching qualification' });
    }

    res.status(200).send(users);
  } catch (error) {
    console.error('Error in fetchUsersByQualification:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};






const updateUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedDetails = req.body;
console.log("update user triggred");
    // Handle file uploads if any
    if (req.files) {
      if (req.files.image) {
        updatedDetails.image = req.files.image[0].path.replace(/\\/g, '/');
      }
      if (req.files.images) {
        updatedDetails.images = req.files.images.map(file => file.path.replace(/\\/g, '/'));
      }
      if (req.files.reels) {
        updatedDetails.reels = req.files.reels.map(file => file.path.replace(/\\/g, '/'));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedDetails, { new: true });

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Exclude password from user object
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    res.status(200).send(userWithoutPassword);
  } catch (error) {
    console.error('Error in updateUserDetails:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};


const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUserAccount:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};



module.exports = { signupUser,  loginUser, fetchUser, fetchUsersByFilters,  fetchUsersByLocation, fetchUsersByDesignation, fetchUsersByQualification, updateUserDetails,deleteUserAccount };

