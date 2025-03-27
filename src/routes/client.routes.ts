import { Router } from 'express';
import { createClient } from '../controllers/client.controller';

const router = Router();

// Route pour créer un client
router.post('/clients', createClient);

export default router;