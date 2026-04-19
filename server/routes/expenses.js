const express = require('express');
const protect = require('../middleware/auth');
const { 
  getExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expenseController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(addExpense);

router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;

