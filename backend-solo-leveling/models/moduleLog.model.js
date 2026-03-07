const mongoose = require('mongoose');

const moduleLogSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    default: 1
  },
  note: {
    type: String
  },
  xpAwarded: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for unique logs per module per day
moduleLogSchema.index({ moduleId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ModuleLog', moduleLogSchema);
