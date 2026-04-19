const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const Investment = require('../models/Investment');

// @desc Get dashboard stats
// @route GET /api/dashboard/stats
// @access Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total expenses this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalExpenses = await Expense.aggregate([
      { $match: { 
        userId, 
        date: { $gte: monthStart }
      }},
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Budget usage
    const budgets = await Budget.find({ userId });
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const usedBudget = budgets.reduce((sum, b) => sum + b.spent || 0, 0);

    // Goal progress %
    const goals = await Goal.find({ userId });
    const avgGoalProgress = goals.length > 0 ? 
      goals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount * 100), 0) / goals.length : 0;

    // Total investments (Current Value & Invested Amount)
    const investments = await Investment.find({ userId });
    const totalInvestments = investments.reduce((sum, i) => sum + (i.currentValue || i.amount || 0), 0);
    const totalInvested = investments.reduce((sum, i) => sum + (i.amount || 0), 0);

    // Category breakdown
    const categoryExpenses = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      stats: {
        totalExpenses: totalExpenses[0]?.total || 0,
        totalBudget,
        budgetUsed: usedBudget,
        budgetRemaining: totalBudget - usedBudget,
        avgGoalProgress,
        totalInvestments,
        totalInvested,
        activeGoals: goals.length,
        recentExpenses: await Expense.find({ userId }).sort({ date: -1 }).limit(5)
      },
      categories: categoryExpenses
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getDashboardStats
};

