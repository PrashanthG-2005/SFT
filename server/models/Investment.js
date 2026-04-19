const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Investment name is required']
  },
  type: {
    type: String,
    required: [true, 'Investment type is required'],
    enum: ['SIP', 'Stock', 'Mutual Fund', 'FD', 'Other']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  expectedReturn: {
    type: Number,
    default: 0
  },
  currentValue: {
    type: Number,
    required: [true, 'Current value is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);

