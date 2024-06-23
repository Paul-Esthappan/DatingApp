const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  createDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
