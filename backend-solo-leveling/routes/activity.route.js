const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getActivity, logActivity } = require('../controllers/activity.controller');

router.use(authMiddleware);

router.get('/', getActivity);
router.post('/log', logActivity);

module.exports = router;
