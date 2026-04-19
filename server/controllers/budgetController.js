const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Add budget
// @route   POST /api/budgets
// @access  Private
const addBudget = async (req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Calculate initial spent from existing expenses for this category and month
    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1));
    
    const expenses = await Expense.find({
      userId: req.user._id,
      category: req.body.category,
      date: { $gte: startOfMonth, $lt: endOfMonth }
    });
    
    const initialSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const budgetData = {
      ...req.body,
      userId: req.user._id,
      month,
      spent: initialSpent
    };
    
    const budget = await Budget.create(budgetData);
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ msg: 'Budget not found' });
    }
    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(updatedBudget);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ msg: 'Budget not found or not authorized' });
    }

    res.json({ msg: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget
};

