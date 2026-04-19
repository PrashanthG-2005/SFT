const express = require('express');
const protect = require('../middleware/auth');
const { getGoals, addGoal, addToGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(addGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

router.route('/:id/add')
  .put(addToGoal);

module.exports = router;

