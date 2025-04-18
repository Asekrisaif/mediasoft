import { Router } from 'express';
import { 
  adminLogin,
  createAdmin, 
  blockUser, 
  unblockUser, 
  exportUsers 
} from '../controllers/admin.controller';

const router = Router();

// Route de connexion admin
router.post('/login', adminLogin);

// Autres routes admin
router.post('/', createAdmin); // Changé de '/admins' à '/'
router.put('/users/:id/block', blockUser);
router.put('/users/:id/unblock', unblockUser);
router.get('/export-users/:format', exportUsers);

export default router;