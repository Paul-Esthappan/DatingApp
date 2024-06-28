const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authentication');
require('dotenv').config();
require('./config/passport');
require('./db/connection');
const cors = require('cors');

const port = process.env.PORT || 3001;

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}! 😍`);
});


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));