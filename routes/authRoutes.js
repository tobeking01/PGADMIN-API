const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Get user profile (protected)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
