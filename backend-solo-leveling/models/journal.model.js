const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  module: {
    type: String,
    enum: ['books', 'dsa', 'skills'],
    required: true
  },
  entries: [{
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
});

journalSchema.index({ userId: 1, module: 1 }, { unique: true });

module.exports = mongoose.model('Journal', journalSchema);
