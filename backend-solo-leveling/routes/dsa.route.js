const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getDSA, updateDSA, addCategory, addTopic } = require('../controllers/dsa.controller');

router.use(authMiddleware);

router.get('/', getDSA);
router.patch('/', updateDSA);
router.post('/category', addCategory);
router.post('/topic', addTopic);

module.exports = router;
