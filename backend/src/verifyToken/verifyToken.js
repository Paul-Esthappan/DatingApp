const jwt = require('jsonwebtoken');

// Verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json('Token not valid');
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(403).json('You are not authenticated');
  }
};

module.exports = { verifyToken };

// Verify Token and Authorization
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user._id === req.params.id) {
      next();
    } else {
      return res.status(403).json('You are not allowed');
    }
  });
};


module.exports = { verifyToken, verifyTokenAndAuthorization };
