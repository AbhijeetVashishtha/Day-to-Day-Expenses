const express = require('express');
const premiumUserController = require('../controllers/premiumuser');
const authenticatemiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/showLeaderBoard',authenticatemiddleware.authenticate, premiumUserController.getUserLeaderBoard);

module.exports = router;