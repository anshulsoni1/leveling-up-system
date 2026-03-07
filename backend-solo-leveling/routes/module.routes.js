const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createModule, getUserModules, deleteModule } = require('../controllers/module.controller');

router.get('/test', (req, res) => {
  res.json({ message: "Modules route working" });
});

router.post('/', authMiddleware, createModule);
router.get('/', authMiddleware, getUserModules);
router.delete('/:id', authMiddleware, deleteModule);

module.exports = router;
