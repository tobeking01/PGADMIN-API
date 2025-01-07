// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password of minimum 6 characters is required').isLength({ min: 6 }),
  ],
  authController.register
);

// User login
router.post(
  '/login',
  [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

// Get user profile (protected)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
