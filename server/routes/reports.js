const express = require('express');
const protect = require('../middleware/auth');
const { getReports } = require('../controllers/reportsController');

const router = express.Router();

router.use(protect);

router.get('/', getReports);

module.exports = router;

