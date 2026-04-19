const Expense = require('../models/Expense');

// @desc Get reports data
// @route GET /api/reports?start=YYYY-MM-DD&end=YYYY-MM-DD&category=?
// @access Private
const getReports = async (req, res) => {
  try {
    const { start, end, category } = req.query;
    const userId = req.user._id;
    const match = { userId };

    if (start || end) {
      const dateFilter = {};
      if (start) dateFilter.$gte = new Date(start);
      if (end) dateFilter.$lte = new Date(end);
      match.date = dateFilter;
    }

    if (category) match.category = category;

    const expenses = await Expense.find(match).sort({ date: -1 });

    // Aggregations
    const categorySummary = await Expense.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    const monthlySummary = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json({
      expenses,
      summary: {
        total: expenses.reduce((sum, e) => sum + e.amount, 0),
        count: expenses.length,
        categories: categorySummary,
        monthly: monthlySummary
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { getReports };

