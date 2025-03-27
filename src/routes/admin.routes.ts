import { Router } from 'express';
import { createAdmin, blockUser, unblockUser, exportUsers } from '../controllers/admin.controller';

const router = Router();

// Route pour créer un administrateur
router.post('/admins', createAdmin);

// Route pour bloquer un utilisateur
router.put('/users/:id/block', blockUser);

// Route pour débloquer un utilisateur
router.put('/users/:id/unblock', unblockUser);

// Route pour exporter les utilisateurs (CSV ou PDF)
router.get('/export-users/:format', exportUsers);

export default router;