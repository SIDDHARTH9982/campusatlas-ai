const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const StudentPurchase = require('../models/StudentPurchase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token, user });
};

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const allowedRoles = ['student', 'institutionAdmin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role for signup' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, role });
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    let hasPurchase = false;
    if (user.role === 'student') {
      const purchase = await StudentPurchase.findOne({ userId: user._id, status: 'completed' });
      hasPurchase = !!purchase;
    }
    const token = generateToken(user._id);
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    };
    res.status(200)
      .cookie('token', token, options)
      .json({ success: true, token, user, hasPurchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.json({ success: true, message: 'Logged out' });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let hasPurchase = false;
    if (user.role === 'student') {
      const purchase = await StudentPurchase.findOne({ userId: user._id, status: 'completed' });
      hasPurchase = !!purchase;
    }
    res.json({ success: true, user, hasPurchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const signupValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'institutionAdmin']).withMessage('Role must be student or institutionAdmin'),
];

const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { signup, login, logout, getMe, signupValidators, loginValidators };
