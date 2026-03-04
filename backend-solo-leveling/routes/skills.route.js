const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getSkills, updateSkills, addSkill, addLog } = require('../controllers/skills.controller');

router.use(authMiddleware);

router.get('/', getSkills);
router.patch('/', updateSkills);
router.post('/add', addSkill);
router.post('/log', addLog);

module.exports = router;
