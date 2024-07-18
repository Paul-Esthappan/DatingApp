// src/models/datingSchema.js
const mongoose = require('mongoose');

const DatingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  relationship: {
    type: String,
    enum: ['shortTerm', 'longTerm',''],
    required: true
  },
  sexualOrientation: {
    type: String,
    enum: ['men', 'women', 'both',''],
    required: true
  },
  matrimonyRegistered: {
    type: Boolean
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Dating', DatingSchema);
