import { Router } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import * as messagerieController from '../controllers/messagerie.controller';

export const setupMessagerieRoutes = (io: SocketIOServer): Router => {
    const router = Router();
    
    // Initialise Socket.io dans le contrôleur
    messagerieController.initSocket(io);

    router.post('/send-message', messagerieController.sendMessageToAdmin);
    router.post('/reply-message', messagerieController.replyToClientMessage);
    router.get('/client-messages/:utilisateur_id', messagerieController.getClientMessages);
    router.get('/all-messages', messagerieController.getAllMessagesForAdmin);
    router.get('/export-csv', messagerieController.exportClientMessagesToCSV);
    router.get('/export-pdf', messagerieController.exportClientMessagesToPDF);
    router.get('/admin-replies', messagerieController.getAdminReplies);

    return router;
};