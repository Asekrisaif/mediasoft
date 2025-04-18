import { Router } from 'express';
import { resetPassword, verifyResetToken, login, verifyEmail,resendVerificationEmail,checkEmail } from '../controllers/auth.controller';

const router = Router();
router.post('/login', login);

// Email verification routes
router.get('/verify-email', verifyEmail);

// Password reset routes
router.post('/reset-password', resetPassword);
router.post('/verify-reset-token', verifyResetToken);
// Ajoutez cette route à votre router
router.get('/check-email', checkEmail);
router.post('/resend-verification', resendVerificationEmail);

export default router;