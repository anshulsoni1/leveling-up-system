const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getMe, updateProfile, updateState, updateXP, updateQuests } = require('../controllers/user.controller');

router.use(authMiddleware);

router.get('/me', getMe);
router.patch('/', updateProfile);
router.patch('/state', updateState);
router.patch('/xp', updateXP);
router.patch('/quests', updateQuests);

module.exports = router;
