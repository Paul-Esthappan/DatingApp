const express = require('express');
const router = express.Router();
const { verifyToken } = require('../verifyToken/verifyToken');
const { addEmploymentDetails } = require('../controllers/employmentControllers');

router.post('/add/:id',  addEmploymentDetails);

module.exports = router;
