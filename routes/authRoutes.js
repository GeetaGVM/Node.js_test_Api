const express = require('express');
const router = express.Router();
const {registerUser,loginWithPassword,requestLoginOTP,loginWithOTP,resendOTP,verifyOTP,verifyForgotPasswordOTP,resetPassword,forgotPassword,getAllUsers,logout} = require('../controller/authController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');


router.post('/register', registerUser);
router.post('/login_with_password', loginWithPassword);
router.post('/request_login_otp', requestLoginOTP);
router.post('/login_with_otp', loginWithOTP);
router.post('/logout', authenticate,logout);
router.post('/send_otp', resendOTP);
router.post('/verify_otp',verifyOTP);
router.post('/verify_forgot_password_otp',verifyForgotPasswordOTP);
router.post('/forgot-password', authenticate,forgotPassword);
router.post('/reset-password', authenticate,resetPassword);
router.get('/getallusers', authenticate,authorize('admin'),getAllUsers);


module.exports = router
