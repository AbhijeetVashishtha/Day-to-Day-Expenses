const express = require('express');
const expenseController = require('../controllers/expense');
const router = express.Router();

router.post('/addexpense', expenseController.addExpense);

router.get('/getexpenses', expenseController.getExpense);

router.delete('/deleteexpense/:expenseid', expenseController.deleteExpense);

module.exports = router;