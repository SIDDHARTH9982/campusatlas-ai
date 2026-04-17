const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { sendMessage, getSessions, getSession, createSession, deleteSession } = require('../controllers/chatController');

const router = express.Router();

router.use(protect, authorize('student'));

router.post('/message', sendMessage);
router.get('/sessions', getSessions);
router.post('/session', createSession);
router.get('/session/:id', getSession);
router.delete('/session/:id', deleteSession);

module.exports = router;
