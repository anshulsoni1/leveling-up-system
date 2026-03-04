const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getBooks, updateBooks, addLog } = require('../controllers/books.controller');

router.use(authMiddleware);

router.get('/', getBooks);
router.patch('/', updateBooks);
router.post('/log', addLog);

module.exports = router;
