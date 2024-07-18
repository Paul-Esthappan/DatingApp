const express = require('express');
const {
  signupUser,
  loginUser,
  fetchUser,
  fetchUsersByLocation,
  fetchUsersByDesignation,
  fetchUsersByQualification,
  updateUserDetails,
  deleteUserAccount
} = require('../controllers/userController');
const upload = require('../middlewares/upload');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

const cpUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 },
  { name: 'reels', maxCount: 3 }
]);

router.post('/auth/signup', cpUpload, signupUser);
router.post('/auth/login', loginUser);

router.get('/auth/fetchuser/:id', authenticateToken, fetchUser);

router.get('/users/location', authenticateToken, fetchUsersByLocation);
router.get('/users/designation', authenticateToken, fetchUsersByDesignation);
router.get('/users/qualification', authenticateToken, fetchUsersByQualification);

router.put('/update', authenticateToken, updateUserDetails);
router.delete('/delete', authenticateToken, deleteUserAccount);

module.exports = router;
