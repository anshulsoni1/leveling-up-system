const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { checkAndSpawnBoss } = require('../services/bossEngine');

// GET /api/boss/current
// Query params: ?inactiveDays=X
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const { inactiveDays } = req.query;
    
    const currentBoss = await checkAndSpawnBoss(
       req.userId, 
       parseInt(inactiveDays) || 0
    );
    
    res.status(200).json(currentBoss);
  } catch (error) {
    res.status(500).json({ message: 'Failed to parse boss status', error: error.message });
  }
});

module.exports = router;
