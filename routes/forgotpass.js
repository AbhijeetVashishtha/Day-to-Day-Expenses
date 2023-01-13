const express = require('express');
const forgotPassController = require('../controllers/forgotpass');

const router = express.Router();

router.get('/updatepassword/:resetpasswordid', forgotPassController.updatePassword);

router.get('/resetpassword/:id', forgotPassController.resetPassword);

router.use('/forgotpassword', forgotPassController.forgotPassword);

module.exports = router;