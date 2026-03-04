const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
   achievements: [
      {
         key: { type: String, required: true },
         unlockedAt: { type: Date, default: Date.now }
      }
   ]
}, { timestamps: true });

module.exports = mongoose.model('Achievement', AchievementSchema);