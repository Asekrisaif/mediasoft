import { Router } from 'express';
import { addUser, checkUser, getUsers, getUserById, updateUser, searchUsers, resetPassword,
     verifyResetToken, forgotPassword, unblockUser, blockUser, exportUsers, sendNotificationToAllClients,markNotificationAsRead
} from '../controllers/user.controller';

const router = Router();

router.get('/all', getUsers); // Route pour récupérer tous les utilisateurs
router.post('/add', addUser); // Route pour ajouter un utilisateur
router.post('/check', checkUser); // Route pour vérifier un utilisateur
router.get('/search', searchUsers); // Route pour rechercher des utilisateurs
router.get('/:id', getUserById); // Route pour récupérer un utilisateur par son ID
router.put('/:id', updateUser); // Route pour mettre à jour un utilisateur par son ID
router.post('/reset-password', resetPassword); // Route pour réinitialiser le mot de passe
router.post('/verify-reset-token', verifyResetToken); // Route pour vérifier le token et modifier le mot de passe
router.post('/forgot-password', forgotPassword); // Route pour demander la réinitialisation du mot de passe
router.put('/block/:id', blockUser); // Route pour bloquer un utilisateur
router.put('/unblock/:id', unblockUser); // Route pour débloquer un utilisateur
router.get('/export/:format', exportUsers); // Route pour exporter les utilisateurs
router.post('/notifications/send-to-all-clients', sendNotificationToAllClients);// Route pour envoyer une notification à tous les clients
router.put('/notifications/:notificationId/mark-as-read', markNotificationAsRead);
// Route pour marquer une notification comme lue
export default router;