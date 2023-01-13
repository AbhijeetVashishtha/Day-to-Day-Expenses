const express = require('express');
const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');
const router = express.Router();

router.post('/addexpense', userAuthentication.authenticate, expenseController.addExpense);

router.get('/getexpenses',userAuthentication.authenticate, expenseController.getExpense);

router.get('/download', userAuthentication.authenticate, expenseController.downloadExpense);

router.get('/getAllUrl', userAuthentication.authenticate, expenseController.downloadAllUrl);

router.delete('/deleteexpense/:expenseid', userAuthentication.authenticate, expenseController.deleteExpense);

module.exports = router;