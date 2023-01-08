const express = require('express');
const purchasecontroller = require('../controllers/purchase');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', userAuthentication.authenticate, purchasecontroller.purchasePremium);

router.post('/updatetransactionstatus', userAuthentication.authenticate, purchasecontroller.updateTransactionStatus);

exports.module = router;
