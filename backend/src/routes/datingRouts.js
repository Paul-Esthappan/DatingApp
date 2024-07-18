// src/routes/datingRoutes.js
const express = require('express');
const { addDatingInfo } = require('../controllers/datingController');
const { verifyToken } = require('../verifyToken/verifyToken');

const router = express.Router();

router.post('/add/:userId',  addDatingInfo);

module.exports = router;
