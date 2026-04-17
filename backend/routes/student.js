const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  purchaseAccess, getAccessStatus, selectInstitution, getDashboard, getNotices,
} = require('../controllers/studentController');

const router = express.Router();

router.use(protect, authorize('student'));

router.post('/purchase-access', purchaseAccess);
router.get('/access-status', getAccessStatus);
router.post('/select-institution', selectInstitution);
router.get('/dashboard', getDashboard);
router.get('/notices', getNotices);

module.exports = router;
