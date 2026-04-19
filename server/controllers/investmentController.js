const Investment = require('../models/Investment');

// @desc    Get investments
// @route   GET /api/investments
// @access  Private
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Add investment
// @route   POST /api/investments
// @access  Private
const addInvestment = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    if (req.body.currentValue === undefined || req.body.currentValue === "") {
      req.body.currentValue = req.body.amount;
    }
    const investment = await Investment.create(req.body);
    res.status(201).json(investment);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const updateInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    if (investment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const updatedInvestment = await Investment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(updatedInvestment);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found or not authorized' });
    }

    res.json({ msg: 'Investment deleted' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getInvestments,
  addInvestment,
  updateInvestment,
  deleteInvestment
};

