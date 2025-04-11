import { Router } from 'express';
import { createClient, getHistoriqueAchats, getAllHistoriqueAchats, getClientDetails,getMyProfile } from '../controllers/client.controller';
import { isClient } from '../middleware/role.middleware';

const router = Router();

// Route publique pour créer un client
router.post('/clients', createClient);
// Route protégée pour récupérer le profil complet
router.get('/clients/me', isClient, getMyProfile);

// Routes protégées nécessitant un client authentifié
router.get('/clients/:clientId/historique', isClient, getHistoriqueAchats);
router.get('/historique-global', isClient, getAllHistoriqueAchats); 
router.get('/clients/:clientId/details', isClient, getClientDetails);

export default router;