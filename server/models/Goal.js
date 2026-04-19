const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Goal title is required']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required']
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);

