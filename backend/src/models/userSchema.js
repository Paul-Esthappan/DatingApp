const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true},
  displayName: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String},
  phoneNumber: { type: String, unique: true },
  dob: { type: Date},
  gender: { type: String },
  country: { type: String },
  designation: { type: String },
  createDate: { type: Date, default: Date.now },
  qualification: { type: [String]},
  accessToken: { type: String },
  refreshToken: { type: String },
  createDate: { type: Date, default: Date.now },// assuming qualifications are strings in an array
  lastLogin: { type: String },
  subscriptionStatus: { type: String },
  interests: { type: String, required: true },
  drinkingHabits: { type: String, required: true },
  smokingHabits: { type: String, required: true },
  profilePicture: { type: String },
  images: [{ type: String }],
  reels: [{ type: String }]
  
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
