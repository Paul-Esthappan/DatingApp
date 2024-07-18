const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authentication');
const userRoutes = require('./routes/userRouter');
const employmentRouter = require('./routes/employmentRoutes')
const datingRoutes = require('./routes/datingRouts')
const interactionRouter = require('./routes/interactionRouter')
const messageRouter = require('./routes/messageRouter')

require('dotenv').config();
require('./config/passport');
require('./db/connection');
const cors = require('cors');
const path = require('path');

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));



// Enable CORS to allow frontend access
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
}));



app.use(passport.initialize());
app.use(passport.session());


// Serve static files from 'uploads' directory
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));


// Routes setup
app.use('/auth', authRoutes);  // Update the base URL
app.use('/api', userRoutes);
app.use('/api/employment', employmentRouter);
app.use('/api/dating', datingRoutes);
app.use('/api/interactions', interactionRouter);
app.use('/api/messages', messageRouter);
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}! 😍`);
});
