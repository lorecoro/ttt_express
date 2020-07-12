const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/board', controller.retrieve);
router.get('/player', controller.player);
router.get('/reset', controller.reset);
router.post('/board', controller.store);

module.exports = router;