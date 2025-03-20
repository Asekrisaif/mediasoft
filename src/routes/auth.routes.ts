import { Router } from 'express';
import { resetPassword, verifyResetToken } from '../controllers/auth.controller';

const router = Router();

// Demander une réinitialisation de mot de passe
router.post('/reset-password', resetPassword);

// Vérifier le token et réinitialiser le mot de passe
router.post('/verify-reset-token', verifyResetToken);

export default router;