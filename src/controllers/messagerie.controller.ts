import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendMessageToAdmin = async (req: Request, res: Response): Promise<void> => {
    const { utilisateur_id, contenu } = req.body;

    if (!utilisateur_id || !contenu) {
        res.status(400).json({ error: 'L\'ID de l\'utilisateur et le contenu du message sont requis.' });
        return;
    }

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { id: utilisateur_id },
            include: { client: true },
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
        });

        res.status(201).json({ message: 'Message envoyé avec succès', data: message });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de l\'envoi du message', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de l\'envoi du message' });
        }
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
            include: { admin: true },
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
        });

        res.status(201).json({ message: 'Réponse envoyée avec succès', data: replyMessage });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de l\'envoi de la réponse', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de l\'envoi de la réponse' });
        }
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