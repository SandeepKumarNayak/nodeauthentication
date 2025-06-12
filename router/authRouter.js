import express from 'express';
import { changePassword, forgotPasswordCodeVerification, sendForgotPasswordCode, sendVerificationCode, signIn, signOut, signUp, verifyVerificationCode } from '../controllers/authController.js';
import { identification } from '../middleware/identification.js';


const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.patch('/sendverificationcode',identification,sendVerificationCode);
router.patch('/verifycode',identification,verifyVerificationCode)

router.patch('/send-forgot-password-code',sendForgotPasswordCode );
router.patch('/forgotpassword-code-verification',forgotPasswordCodeVerification);
router.patch('/changepassword',identification,changePassword);
router.post('/signout',identification,signOut);

export default router;