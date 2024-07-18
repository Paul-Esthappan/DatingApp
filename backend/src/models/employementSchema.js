const mongoose = require('mongoose');

// Define the Employment schema
const employmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  companyLocation: {
    type: String,
    required: true
  },
  professionTitle: {
    type: String,
    required: false // Optional for job seekers
  },
  expertiseLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert',''],
    required: false // Optional for job seekers
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Employment model
const Employment = mongoose.model('Employment', employmentSchema);

module.exports = Employment;
