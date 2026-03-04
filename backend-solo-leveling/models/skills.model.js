const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  skills: [{
    name: { type: String },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    logs: [{
      text: { type: String },
      date: { type: Date, default: Date.now }
    }]
  }]
});

module.exports = mongoose.model('Skill', skillsSchema);
