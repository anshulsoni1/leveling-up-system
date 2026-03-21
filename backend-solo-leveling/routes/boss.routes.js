const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { checkAndSpawnBoss, dealDamageToBoss } = require('../services/bossEngine');

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


// POST /api/boss/damage
router.post('/damage', authMiddleware, async (req, res) => {
  try {
    const { damage } = req.body;
    const result = await dealDamageToBoss(req.userId, damage || 0);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to deal damage', error: error.message });
  }
});

module.exports = router;
