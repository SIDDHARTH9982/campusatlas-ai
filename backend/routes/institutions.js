const express = require('express');
const { getActiveInstitutions, getInstitutionById } = require('../controllers/institutionController');

const router = express.Router();

router.get('/active', getActiveInstitutions);
router.get('/:id', getInstitutionById);

module.exports = router;
