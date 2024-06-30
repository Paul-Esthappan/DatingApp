const multer = require('multer');
const path = require('path');

// Define storage for the images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // You can differentiate storage directories based on file field name
    if (file.fieldname === 'profilePicture') {
      cb(null, 'uploads/profile_pictures');
    } else if (file.fieldname === 'images') {
      cb(null, 'uploads/images');
    } else if (file.fieldname === 'reels') {
      cb(null, 'uploads/reels');
    } else {
      cb(null, 'uploads/others');
    }
  },
  filename: (req, file, cb) => {
    // Set the file name
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|mp4|mov/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb('Error: File type not supported');
  }
};

// Define the upload function with limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
