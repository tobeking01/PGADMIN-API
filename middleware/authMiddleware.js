const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Retrieve token from headers
    const authHeader = req.header('Authorization');
    const token = req.header('x-auth-token') || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(500).json({ message: 'Server error during token verification' });
  }
};
