const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const achievementController = require('../controllers/achievement.controller');

router.use(authMiddleware);

router.get('/', achievementController.getAchievements);
router.post('/check', achievementController.checkAchievements);

module.exports = router;