const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  rewardXP: { type: Number, default: 50 },
  type: { type: String, enum: ['Daily', 'Recovery', 'Boss', 'Streak', 'Balance'], default: 'Daily' },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quest', questSchema);