import { Router } from 'express';
import { createClient,getHistoriqueAchats,getAllHistoriqueAchats } from '../controllers/client.controller';

const router = Router();

// Route pour créer un client
router.post('/clients', createClient);
router.get('/clients/:clientId/historique', getHistoriqueAchats);
router.get('/historique-global', getAllHistoriqueAchats); 

export default router;