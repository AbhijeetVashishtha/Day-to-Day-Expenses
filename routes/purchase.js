const express = require('express');
const purchasecontroller = require('../controllers/purchase');
const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticatemiddleware.authenticate, purchasecontroller.purchasePremium);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchasecontroller.updateTransactionStatus);

module.exports = router;
