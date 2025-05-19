const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token received:', token.substring(0, 20) + '...');
  }

  if (!token) {
    console.log('No token provided in request');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully. User ID:', decoded.id);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found in database for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    console.log('User found:', { id: user._id, role: user.role });
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};