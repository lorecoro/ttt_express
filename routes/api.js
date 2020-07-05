const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/board', controller.retrieve);
router.post('/board', controller.store);

module.exports = router;