import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import { Server } from 'socket.io';

const prisma = new PrismaClient();
let io: Server;

export const initSocket = (socketIo: Server) => {
    io = socketIo;
};

export const sendMessageToAdmin = async (req: Request, res: Response): Promise<void> => {
    const { utilisateur_id, contenu } = req.body;

    if (!utilisateur_id || !contenu) {
        res.status(400).json({ error: 'L\'ID de l\'utilisateur et le contenu du message sont requis.' });
        return;
    }

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { id: utilisateur_id },
        });

        if (!user || user.role !== 'client') {
            res.status(404).json({ error: 'Utilisateur non trouvé ou non autorisé.' });
            return;
        }

        const message = await prisma.messagerie.create({
            data: {
                contenu,
                date_envoi: new Date(),
                utilisateur_id,
            },
            include: {
                utilisateur: {
                    select: {
                        id: true,
                        nom: true,
                        email: true,
                    }
                }
            }
        });

        // Émettre le nouveau message à tous les admins
        io.emit('new_message_admin', message);

        res.status(201).json({ message: 'Message envoyé avec succès', data: message });
    } catch (err) {
        handleError(res, err, 'Erreur lors de l\'envoi du message');
    }
};

export const replyToClientMessage = async (req: Request, res: Response): Promise<void> => {
    const { message_id, admin_id, contenu } = req.body;

    if (!message_id || !admin_id || !contenu) {
        res.status(400).json({ error: 'L\'ID du message, l\'ID de l\'administrateur et le contenu de la réponse sont requis.' });
        return;
    }

    try {
        const admin = await prisma.utilisateur.findUnique({
            where: { id: admin_id },
        });

        if (!admin || admin.role !== 'admin') {
            res.status(404).json({ error: 'Administrateur non trouvé ou non autorisé.' });
            return;
        }

        const originalMessage = await prisma.messagerie.findUnique({
            where: { id: message_id },
        });

        if (!originalMessage) {
            res.status(404).json({ error: 'Message non trouvé.' });
            return;
        }

        const replyMessage = await prisma.messagerie.create({
            data: {
                contenu,
                date_envoi: new Date(),
                utilisateur_id: admin_id,
                parent_message_id: message_id,
            },
            include: {
                utilisateur: {
                    select: {
                        id: true,
                        nom: true,
                        email: true,
                    }
                }
            }
        });

        // Émettre la réponse au client concerné et aux admins
        io.to(`user_${originalMessage.utilisateur_id}`).emit('new_message_client', replyMessage);
        io.emit('new_admin_reply', {
            ...replyMessage,
            originalMessageId: message_id,
            clientId: originalMessage.utilisateur_id
        });

        res.status(201).json({ message: 'Réponse envoyée avec succès', data: replyMessage });
    } catch (err) {
        handleError(res, err, 'Erreur lors de l\'envoi de la réponse');
    }
};


export const getClientMessages = async (req: Request, res: Response): Promise<void> => {
    const { utilisateur_id } = req.params;

    if (!utilisateur_id || isNaN(Number(utilisateur_id))) {
        res.status(400).json({ error: 'ID de l\'utilisateur invalide ou manquant.' });
        return;
    }

    try {
        const messages = await prisma.messagerie.findMany({
            where: {
                OR: [
                    { utilisateur_id: Number(utilisateur_id) },
                    { parent_message_id: { not: null }, utilisateur: { role: 'admin' } },
                ],
            },
            include: {
                utilisateur: true,
            },
            orderBy: {
                date_envoi: 'asc',
            },
        });

        res.status(200).json({ messages });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des messages', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des messages' });
        }
    }
};

export const getAllMessagesForAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const messages = await prisma.messagerie.findMany({
            include: {
                utilisateur: true,
            },
            orderBy: {
                date_envoi: 'asc',
            },
        });

        res.status(200).json({ messages });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des messages', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des messages' });
        }
    }
};

export const exportClientMessagesToCSV = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupérer tous les clients avec leurs messages et les réponses de l'admin
        const clients = await prisma.utilisateur.findMany({
            where: { role: 'client' },
            include: {
                messageries: {
                    where: { parent_message_id: null }, // Messages initiaux (non-réponses)
                    include: {
                        replies: { // Réponses de l'admin
                            include: {
                                utilisateur: true, // Informations de l'admin
                            },
                        },
                    },
                },
            },
        });

        // Configurer le CSV Writer
        const csvWriter = createObjectCsvWriter({
            path: 'client_messages.csv',
            header: [
                { id: 'client_id', title: 'Client ID' },
                { id: 'client_nom', title: 'Client Nom' },
                { id: 'client_email', title: 'Client Email' },
                { id: 'message_id', title: 'Message ID' },
                { id: 'message_contenu', title: 'Message Contenu' },
                { id: 'message_date', title: 'Message Date' },
                { id: 'reply_id', title: 'Reply ID' },
                { id: 'reply_contenu', title: 'Reply Contenu' },
                { id: 'reply_date', title: 'Reply Date' },
                { id: 'admin_nom', title: 'Admin Nom' },
            ],
        });

        // Préparer les données pour le CSV
        const records = clients.flatMap(client =>
            client.messageries.flatMap(message => [
                {
                    client_id: client.id,
                    client_nom: client.nom,
                    client_email: client.email,
                    message_id: message.id,
                    message_contenu: message.contenu,
                    message_date: message.date_envoi.toISOString(),
                    reply_id: '',
                    reply_contenu: '',
                    reply_date: '',
                    admin_nom: '',
                },
                ...message.replies.map(reply => ({
                    client_id: client.id,
                    client_nom: client.nom,
                    client_email: client.email,
                    message_id: message.id,
                    message_contenu: message.contenu,
                    message_date: message.date_envoi.toISOString(),
                    reply_id: reply.id,
                    reply_contenu: reply.contenu,
                    reply_date: reply.date_envoi.toISOString(),
                    admin_nom: reply.utilisateur.nom,
                })),
            ])
        );

        // Écrire les données dans le fichier CSV
        await csvWriter.writeRecords(records);

        // Télécharger le fichier CSV
        res.download('client_messages.csv');
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de l\'exportation des messages', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de l\'exportation des messages' });
        }
    }
};

export const exportClientMessagesToPDF = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupérer tous les clients avec leurs messages et les réponses de l'admin
        const clients = await prisma.utilisateur.findMany({
            where: { role: 'client' },
            include: {
                messageries: {
                    where: { parent_message_id: null }, // Messages initiaux (non-réponses)
                    include: {
                        replies: { // Réponses de l'admin
                            include: {
                                utilisateur: true, // Informations de l'admin
                            },
                        },
                    },
                },
            },
        });

        // Créer un document PDF
        const doc = new PDFDocument();
        const filename = 'client_messages.pdf';

        // Configurer les en-têtes de la réponse
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Pipe le PDF dans la réponse
        doc.pipe(res);

        // Ajouter un titre au PDF
        doc.fontSize(18).text('Messages des Clients et Réponses des Admins', { align: 'center' });
        doc.moveDown();

        // Ajouter les données des clients et leurs messages au PDF sous forme de tableaux
        clients.forEach(client => {
            doc.fontSize(14).text(`Client: ${client.nom} (ID: ${client.id}, Email: ${client.email})`, { underline: true });
            doc.moveDown();

            // Tableau pour les messages du client
            doc.fontSize(12).text('Messages:');
            const messageTable = {
                headers: ['ID', 'Contenu', 'Date'],
                rows: client.messageries.map(message => [
                    message.id.toString(),
                    message.contenu,
                    message.date_envoi.toISOString(),
                ]),
            };

            // Dessiner le tableau des messages
            doc.moveDown();
            drawTable(doc, messageTable);
            doc.moveDown();

            // Tableau pour les réponses de l'admin
            doc.fontSize(12).text('Réponses des Admins:');
            const replyTable = {
                headers: ['ID', 'Contenu', 'Date', 'Admin'],
                rows: client.messageries.flatMap(message =>
                    message.replies.map(reply => [
                        reply.id.toString(),
                        reply.contenu,
                        reply.date_envoi.toISOString(),
                        reply.utilisateur.nom,
                    ])
                ),
            };

            // Dessiner le tableau des réponses
            doc.moveDown();
            drawTable(doc, replyTable);
            doc.moveDown(2);
        });

        // Finaliser le PDF
        doc.end();
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de l\'exportation des messages', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de l\'exportation des messages' });
        }
    }
};

// Fonction pour dessiner un tableau dans le PDF
const drawTable = (doc: PDFKit.PDFDocument, table: { headers: string[]; rows: string[][] }) => {
    const columnWidths = [100, 200, 150, 150];
    const rowHeight = 20;

    doc.font('Helvetica-Bold');
    table.headers.forEach((header, i) => {
        doc.text(header, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), doc.y, {
            width: columnWidths[i],
            align: 'left',
        });
    });
    doc.moveDown();

    doc.font('Helvetica');
    table.rows.forEach(row => {
        row.forEach((cell, i) => {
            doc.text(cell, 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), doc.y, {
                width: columnWidths[i],
                align: 'left',
            });
        });
        doc.moveDown();
    });
};

export const getAdminReplies = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupérer toutes les réponses de l'admin
        const replies = await prisma.messagerie.findMany({
            where: {
                utilisateur: { role: 'admin' }, // Seulement les réponses de l'admin
            },
            include: {
                utilisateur: true, // Informations de l'admin
                parentMessage: { // Message original du client
                    include: {
                        utilisateur: true, // Informations du client
                    },
                },
            },
            orderBy: {
                date_envoi: 'asc',
            },
        });

        // Renvoyer les réponses
        res.status(200).json({ replies });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des réponses', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des réponses' });
        }
    }
};
const handleError = (res: Response, err: unknown, defaultMessage: string) => {
    if (err instanceof Error) {
        console.error('Erreur:', err);
        res.status(500).json({ error: defaultMessage, details: err.message });
    } else {
        console.error('Erreur inconnue:', err);
        res.status(500).json({ error: 'Erreur inconnue' });
    }
};