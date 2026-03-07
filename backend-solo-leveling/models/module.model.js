const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '⚔️'
  },
  color: {
    type: String,
    default: '#00eaff'
  },
  category: {
    type: String,
    enum: ['mind', 'body', 'knowledge', 'career', 'custom'],
    default: 'custom'
  },
  trackingType: {
    type: String,
    enum: ['habit', 'counter', 'timer', 'progress'],
    default: 'habit'
  },
  features: {
    streak: {
      type: Boolean,
      default: true
    },
    heatmap: {
      type: Boolean,
      default: true
    },
    journal: {
      type: Boolean,
      default: false
    },
    xp: {
      type: Boolean,
      default: true
    }
  },
  xpReward: {
    type: Number,
    default: 20
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Module', moduleSchema);
