const express = require('express');

const expenseController = require('../controllers/expense');
const userController = require('../controllers/user');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/signup', userController.signUp);

router.post('/login', userController.logIn);

router.post('/getexpense/:pageNo',userAuthentication.authenticate ,expenseController.getExpense);

module.exports = router;