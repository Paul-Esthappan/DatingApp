const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
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

module.exports = authenticateToken;
