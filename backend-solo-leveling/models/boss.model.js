const mongoose = require('mongoose');

const bossSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'Procrastination Demon'
  },
  hp: {
    type: Number,
    default: 300
  },
  maxHp: {
    type: Number,
    default: 300
  },
  damagePerDay: {
    type: Number,
    default: 10
  },
  active: {
    type: Boolean,
    default: true
  },
  spawnDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Boss', bossSchema);
