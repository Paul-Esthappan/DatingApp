const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  googleId: { type: String},
  email: { type: String, required: true},
  password: { type: String },
  displayName: { type: String },
  userName: { type: String },
  shortBio:{type:String},
  dob: { type: Date },
  gender: { type: String },
  location: { type: String },
  phoneNumber: { type: String,  unique: true  },
  qualification: { type: String },
  interests: { type: String },
  drinkingHabits: { type: String },
  smokingHabits: { type: String },
  image: { type: String },
  images: { type: [String] },
  reels: { type: [String] },
  designation: { type: String },
  sentMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  receivedMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  accessToken: { type: String },
  refreshToken: { type: String },
  
  createDate: { type: Date, default: Date.now },
  lastLogin: { type: String },
  subscriptionStatus: { type: String }
  
});


// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;
