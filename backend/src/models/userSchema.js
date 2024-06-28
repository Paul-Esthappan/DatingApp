const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String }, // assuming image URLs are stored as strings
  designation: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
  qualification: { type: [String], required: true },
  accessToken: { type: String },
  refreshToken: { type: String },
  createDate: { type: Date, default: Date.now }// assuming qualifications are strings in an array
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
