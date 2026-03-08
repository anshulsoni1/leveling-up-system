const express = require('express');
const router = express.Router();
const { generateDailyQuests } = require('../services/questEngine');
const Quest = require('../models/quest.model');
const authMiddleware = require('../middleware/auth.middleware');

// GET /api/quests/daily
router.get('/daily', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // For now we mock the userStats by reading req.query or default
    const userStats = {
      inactiveDays: parseInt(req.query.inactiveDays) || 0,
      streak: parseInt(req.query.streak) || 0,
      moduleInactive: req.query.moduleInactive === 'true'
    };

    const quests = await generateDailyQuests(userId, userStats);
    res.json({ quests });
  } catch (error) {
    console.error('Error generating quests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update completion status
router.put('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const quest = await Quest.findOneAndUpdate(
       { _id: req.params.id, userId: req.user.id },
       { completed: true },
       { new: true }
    );
    res.json(quest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;