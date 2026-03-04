const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getJournal, addEntry, deleteEntry } = require('../controllers/journal.controller');

router.use(authMiddleware);

router.get('/:module', getJournal);
router.post('/:module', addEntry);
router.delete('/:module/:entryId', deleteEntry);

module.exports = router;
