// src/routes/messagerie.routes.ts
import { Router } from 'express';
import {
    sendMessageToAdmin,
    replyToClientMessage,
    getClientMessages,
    getAllMessagesForAdmin
} from '../controllers/messagerie.controller'; // Assurez-vous que le chemin est correct

const router = Router();

// Route pour envoyer un message à l'admin (client → admin)
router.post('/send-message', sendMessageToAdmin);

// Route pour répondre à un message (admin → client)
router.post('/reply-message', replyToClientMessage);

// Route pour récupérer les messages d'un client (client ou admin)
router.get('/client-messages/:utilisateur_id', getClientMessages);

// Route pour récupérer tous les messages (admin seulement)
router.get('/all-messages', getAllMessagesForAdmin);

export default router;