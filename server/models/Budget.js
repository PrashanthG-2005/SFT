const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required']
  },
  spent: {
    type: Number,
    default: 0
  },
  month: {
    type: String, // '2024-04'
    required: true
  }
}, { timestamps: true });

budgetSchema.index({ userId: 1, month: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);

