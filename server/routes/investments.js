const express = require('express');
const protect = require('../middleware/auth');
const { getInvestments, addInvestment, updateInvestment, deleteInvestment } = require('../controllers/investmentController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getInvestments)
  .post(addInvestment);

router.route('/:id')
  .put(updateInvestment)
  .delete(deleteInvestment);

module.exports = router;

