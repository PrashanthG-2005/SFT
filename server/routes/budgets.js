const express = require('express');
const protect = require('../middleware/auth');
const { getBudgets, addBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(addBudget);

router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;

