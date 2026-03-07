const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { logActivity, getModuleLogs, deleteLog } = require('../controllers/moduleLog.controller');

router.use(authMiddleware);

router.post('/:moduleId', logActivity);
router.get('/:moduleId', getModuleLogs);
router.delete('/:logId', deleteLog);

module.exports = router;
