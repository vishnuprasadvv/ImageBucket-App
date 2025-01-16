import express from 'express'
import { loginUserController, logoutController, registerUserController, resetPasswordController, sendOtpController } from '../controller/user/userController';

const router = express.Router();

router.post('/login', loginUserController)
router.post('/register', registerUserController)
router.patch('/reset-password', resetPasswordController)
router.post('/send-otp', sendOtpController)
router.post('/logout', logoutController)


export default router;