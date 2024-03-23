const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// Example of protected route using authentication middleware
// @route   GET /api/auth/user
// @desc    Get current user
// @access  Private
// router.get('/user', authMiddleware, (req, res) => {
//   res.json(req.user);
// });

module.exports = router;
