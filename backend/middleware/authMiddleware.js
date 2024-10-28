const jwt = require('jsonwebtoken');
const config = require('../config/index');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  // console.log("request from frontend  == ",req.header);
  console.log("authorization=",authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  console.log("Token from frontend side =", token);

  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Set user from decoded token
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
