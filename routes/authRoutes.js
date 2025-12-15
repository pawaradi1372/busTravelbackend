const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // admin middleware to restrict routes
const {
  register,
  login,
  getProfile,
 
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);



module.exports = router;
