const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  activities: [{
    date: { type: String, required: true },
    count: { type: Number, default: 1 }
  }]
});

module.exports = mongoose.model('Activity', activitySchema);
