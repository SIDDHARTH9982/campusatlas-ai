const express = require('express');
const { signup, login, logout, getMe, signupValidators, loginValidators } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post('/signup', signupValidators, validate, signup);
router.post('/login', loginValidators, validate, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
