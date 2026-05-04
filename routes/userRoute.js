import express from 'express';
import { loginValidation, otpValidation, registerValidation } from '../validators/userValidator.js';
import { loginUser, registerUser, verifyOtp, userDetail, updateProfile } from '../controler/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/verifyOtp', otpValidation, verifyOtp);
router.get('/user-detail', authMiddleware, userDetail);
router.put('/update-profile', authMiddleware, updateProfile);

export default router;