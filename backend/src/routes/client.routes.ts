import { Router } from 'express';
import { createClient, getHistoriqueAchats, getAllHistoriqueAchats, getMyProfile, updateUserInfo } from '../controllers/client.controller';
import { authenticateClient, isClient } from '../middleware/role.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public route to create a client
router.post('/clients', createClient);

// Use the fixed authenticateClient middleware
router.get('/clients/me', authenticateClient, getMyProfile);
router.put('/clients/update', authenticateClient, updateUserInfo);
router.get('/clients/:clientId/historique', authenticate, isClient, getHistoriqueAchats);
router.get('/historique-global', authenticate, isClient, getAllHistoriqueAchats);

export default router;