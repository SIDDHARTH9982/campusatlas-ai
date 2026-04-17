const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getOverview, getProfile, updateProfile,
  courseCRUD, deptCRUD, feeCRUD, scholarshipCRUD, hostelCRUD,
  placementCRUD, noticeCRUD, faqCRUD, knowledgeCRUD,
  contactCRUD, transportCRUD, libraryCRUD,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorize('institutionAdmin'));

router.get('/institution/overview', getOverview);
router.get('/institution/profile', getProfile);
router.put('/institution/profile', updateProfile);

const mountCRUD = (path, crud) => {
  router.get(path, crud.getAll);
  router.get(`${path}/:id`, crud.getOne);
  router.post(path, crud.create);
  router.put(`${path}/:id`, crud.update);
  router.delete(`${path}/:id`, crud.delete);
};

mountCRUD('/courses', courseCRUD);
mountCRUD('/departments', deptCRUD);
mountCRUD('/fees', feeCRUD);
mountCRUD('/scholarships', scholarshipCRUD);
mountCRUD('/hostel', hostelCRUD);
mountCRUD('/placements', placementCRUD);
mountCRUD('/notices', noticeCRUD);
mountCRUD('/faqs', faqCRUD);
mountCRUD('/knowledge', knowledgeCRUD);
mountCRUD('/contacts', contactCRUD);
mountCRUD('/transport', transportCRUD);
mountCRUD('/library', libraryCRUD);

module.exports = router;
