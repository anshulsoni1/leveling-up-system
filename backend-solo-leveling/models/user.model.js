const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  rank: {
    type: String,
    default: 'E'
  },
  quests: {
    type: Array,
    default: []
  },
  displayName: {
    type: String,
    default: 'Shadow Monarch'
  },
  avatarUrl: {
    type: String,
    default: 'assets/images/placeholder.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
