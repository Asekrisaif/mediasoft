import { Router } from 'express';
import { resetPassword, verifyResetToken,login } from '../controllers/auth.controller';

const router = Router();
router.post('/login', login);

// Demander une réinitialisation de mot de passe
router.post('/reset-password', resetPassword);

// Vérifier le token et réinitialiser le mot de passe
router.post('/verify-reset-token', verifyResetToken);


export default router;