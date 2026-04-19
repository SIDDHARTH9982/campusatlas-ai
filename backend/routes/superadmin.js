const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getInstitutions, createInstitution, updateInstitution, updateInstitutionStatus,
  getAnalytics, getStudents, getStudentPurchases, getUsers, updateUser,
} = require('../controllers/superAdminController');

const router = express.Router();

router.use(protect, authorize('superadmin'));

router.get('/institutions', getInstitutions);
router.post('/institutions', createInstitution);
router.put('/institutions/:id', updateInstitution);
router.put('/institutions/:id/status', updateInstitutionStatus);
router.get('/analytics', getAnalytics);
router.get('/students', getStudents);
router.get('/student-purchases', getStudentPurchases);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);

module.exports = router;
