const Goal = require('../models/Goal');

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Add goal
// @route   POST /api/goals
// @access  Private
const addGoal = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    const goal = await Goal.create(req.body);
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Update goal current amount
// @route   PUT /api/goals/:id/add
// @access  Private
const addToGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    goal.currentAmount += Number(req.body.amount);
    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found or not authorized' });
    }

    res.json({ msg: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getGoals,
  addGoal,
  addToGoal,
  updateGoal,
  deleteGoal
};

