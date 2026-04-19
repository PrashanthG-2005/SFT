const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
const protect = require('../middleware/auth');
router.get('/me', protect, getMe);

module.exports = router;

