// src/controllers/datingController.js
const Dating = require('../models/datingSchema');

// Add new dating information
const addDatingInfo = async (req, res) => {
  console.log("resssdata", req.body);
  try {
    const { relationship, sexualOrientation, matrimonyRegistered } = req.body;
    const userId = req.params.userId;

    const newDatingInfo = new Dating({
      userId,
      relationship,
      sexualOrientation,
      matrimonyRegistered
    });

    await newDatingInfo.save();

    res.status(201).json({ message: 'Dating info saved successfully', datingInfo: newDatingInfo });
  } catch (error) {
    console.error('Error saving dating info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addDatingInfo
};
