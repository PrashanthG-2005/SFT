const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Get expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Add expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    const expense = await Expense.create(req.body);

    // Sync with Budget
    const dateObj = new Date(expense.date);
    const month = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}`;
    
    await Budget.findOneAndUpdate(
      { userId: req.user._id, category: expense.category, month },
      { $inc: { spent: expense.amount } }
    );

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const oldAmount = expense.amount;
    const oldCategory = expense.category;
    const oldMonth = new Date(expense.date).toISOString().slice(0, 7);

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Sync with Budget
    // 1. Revert old amount
    await Budget.findOneAndUpdate(
      { userId: req.user._id, category: oldCategory, month: oldMonth },
      { $inc: { spent: -oldAmount } }
    );

    // 2. Add new amount
    const newDateObj = new Date(updatedExpense.date);
    const newMonth = `${newDateObj.getUTCFullYear()}-${String(newDateObj.getUTCMonth() + 1).padStart(2, '0')}`;
    
    await Budget.findOneAndUpdate(
      { userId: req.user._id, category: updatedExpense.category, month: newMonth },
      { $inc: { spent: updatedExpense.amount } }
    );

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Sync with Budget
    const dateObj = new Date(expense.date);
    const month = `${dateObj.getUTCFullYear()}-${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}`;
    
    await Budget.findOneAndUpdate(
      { userId: req.user._id, category: expense.category, month },
      { $inc: { spent: -expense.amount } }
    );

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense
};

