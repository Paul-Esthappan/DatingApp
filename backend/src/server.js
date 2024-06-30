const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/userRouter')
require('dotenv').config();
require('./config/passport');
require('./db/connection');
const cors = require('cors');
const path = require('path');

const port = process.env.PORT || 3001;

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

// Routes setup
app.use('/', authRoutes);
// Use routes
app.use('/api', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}! 😍`);
});
