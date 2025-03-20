import { Router } from 'express';
import {
    sendMessageToAdmin,
    replyToClientMessage,
    getClientMessages,
    getAllMessagesForAdmin,
    exportClientMessagesToCSV,
    exportClientMessagesToPDF,
    getAdminReplies,
} from '../controllers/messagerie.controller';

const router = Router();

// Route pour envoyer un message à l'admin (client → admin)
router.post('/send-message', sendMessageToAdmin);

// Route pour répondre à un message (admin → client)
router.post('/reply-message', replyToClientMessage);

// Route pour récupérer les messages d'un client (client ou admin)
router.get('/client-messages/:utilisateur_id', getClientMessages);

// Route pour récupérer tous les messages (admin seulement)
router.get('/all-messages', getAllMessagesForAdmin);

// Route pour exporter les messages en CSV
router.get('/export-csv', exportClientMessagesToCSV);

// Route pour exporter les messages en PDF
router.get('/export-pdf', exportClientMessagesToPDF);

// Route pour récupérer les réponses de l'admin
router.get('/admin-replies', getAdminReplies);

export default router;