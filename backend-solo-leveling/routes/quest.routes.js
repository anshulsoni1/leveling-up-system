const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { generateDailyQuests, checkQuestCompletion } = require('../services/questEngine');
const Quest = require('../models/quest.model');

// GET /api/quests/daily
// Query Params: ?inactiveDays=x&streak=y&bossActive=z
router.get('/daily', authMiddleware, async (req, res) => {
  try {
    const { inactiveDays, streak, bossActive } = req.query;
    
    // Check if we already have incomplete quests today
    const existing = await Quest.find({ userId: req.userId, completed: false });
    
    // Optionally return existing if they exist (or force regenerate)
    // For AI dynamic freshness, we'll actively regenerate based on current state
    const quests = await generateDailyQuests(req.userId, { 
      inactiveDays: parseInt(inactiveDays) || 0, 
      streak: parseInt(streak) || 0,
      bossActive 
    });

    res.status(200).json(quests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate quests', error: error.message });
  }
});

// POST /api/quests/complete/:id
router.post('/complete/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await checkQuestCompletion(id, req.userId);
    res.status(200).json({ message: 'Quest completed', data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
