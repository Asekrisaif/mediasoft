import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Fonction pour générer un token de réinitialisation
const generateResetToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getDefault = (req: Request, res: Response): void => {
    res.json({ msg: 'API fonctionnelle' });
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.utilisateur.findMany();
        res.json({ users });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
    const { nom, prenom, email, telephone, motDePasse, role, ville, codePostal, gouvernorat } = req.body;

    if (!nom || !prenom || !email || !telephone || !motDePasse || !role || !ville || !codePostal || !gouvernorat) {
        res.status(400).json({ error: 'Tous les champs sont requis.' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(motDePasse, 10);
        const newUser = await prisma.utilisateur.create({
            data: {
                nom,
                prenom,
                email,
                telephone,
                motDePasse: hashedPassword,
                role,
                inscritLe: new Date(),
                ville, // Ensure this field is recognized
                codePostal, // Ensure this field is recognized
                gouvernorat // Ensure this field is recognized
            }
        });
        res.status(201).json({ message: 'Utilisateur ajouté avec succès', user: newUser });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur.', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const checkUser = async (req: Request, res: Response): Promise<void> => {
    const { email, motDePasse } = req.body;

    try {
        const user = await prisma.utilisateur.findUnique({ where: { email } });

        if (!user) {
            res.status(404).json({ error: 'Compte incorrect' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (isPasswordValid) {
            res.json({ message: 'Compte correct', user });
        } else {
            res.status(404).json({ error: 'Compte incorrect' });
        }
    } catch (err) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur lors de la vérification de l\'utilisateur', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide ou manquant.' });
        return;
    }

    try {
        const user = await prisma.utilisateur.findUnique({ where: { id: Number(id) } });

        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nom, prenom, email, telephone, motDePasse, ville, codePostal, gouvernorat } = req.body;

    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide' });
        return;
    }

    if (!nom || !prenom || !email || !telephone || !motDePasse || !ville || !codePostal || !gouvernorat) {
        res.status(400).json({ error: 'Tous les champs sont requis.' });
        return;
    }

    try {
        const updatedUser = await prisma.utilisateur.update({
            where: { id: parseInt(id) },
            data: {
                nom,
                prenom,
                email,
                telephone,
                motDePasse,
                ville, // Ensure this field is recognized
                codePostal, // Ensure this field is recognized
                gouvernorat // Ensure this field is recognized
            }
        });
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user: updatedUser });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query;

    if (!query) {
        res.status(400).json({ error: 'Le paramètre de recherche est requis.' });
        return;
    }

    try {
        const users = await prisma.utilisateur.findMany({
            where: {
                OR: [
                    { nom: { contains: query as string, mode: 'insensitive' } },
                    { prenom: { contains: query as string, mode: 'insensitive' } },
                    { email: { contains: query as string, mode: 'insensitive' } }
                ]
            }
        });

        res.json({ users });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de la recherche des utilisateurs', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

// Fonction pour envoyer un email
const sendResetEmail = async (email: string, resetLink: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: 'L\'email est requis.' });
        return;
    }

    try {
        const user = await prisma.utilisateur.findUnique({ where: { email } });

        if (!user) {
            res.status(404).json({ error: 'Utilisateur non trouvé.' });
            return;
        }

        const resetToken = generateResetToken();
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        await prisma.resetToken.create({
            data: {
                token: resetToken,
                utilisateur_id: user.id,
                expiresAt: new Date(Date.now() + 3600000)
            }
        });

        await sendResetEmail(email, resetLink);

        res.status(200).json({ message: 'Un lien de réinitialisation a été envoyé à votre adresse email.' });
    } catch (err) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', err);
        res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const verifyResetToken = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        res.status(400).json({ error: 'Le token et le nouveau mot de passe sont requis.' });
        return;
    }

    try {
        const resetToken = await prisma.resetToken.findFirst({
            where: { token, expiresAt: { gt: new Date() } }
        });

        if (!resetToken) {
            res.status(400).json({ error: 'Token invalide ou expiré.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.utilisateur.update({
            where: { id: resetToken.utilisateur_id },
            data: { motDePasse: hashedPassword }
        });

        await prisma.resetToken.delete({ where: { id: resetToken.id } });

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la vérification du token:', err);
        res.status(500).json({ error: 'Erreur lors de la vérification du token', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: 'L\'email est requis.' });
        return;
    }

    try {
        const user = await prisma.utilisateur.findUnique({ where: { email } });

        if (!user) {
            res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet email.' });
            return;
        }

        const resetToken = generateResetToken();
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        await prisma.resetToken.create({
            data: {
                token: resetToken,
                utilisateur_id: user.id,
                expiresAt: new Date(Date.now() + 3600000)
            }
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Un lien de réinitialisation a été envoyé à votre adresse email.' });
    } catch (err) {
        console.error('Erreur lors de l\'envoi de l\'email:', err);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const blockUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide ou manquant.' });
        return;
    }

    try {
        const updatedUser = await prisma.utilisateur.update({
            where: { id: Number(id) },
            data: { statut: 'bloqué' }
        });

        res.status(200).json({ message: 'Utilisateur bloqué avec succès', user: updatedUser });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors du blocage de l\'utilisateur', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const unblockUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide ou manquant.' });
        return;
    }

    try {
        const updatedUser = await prisma.utilisateur.update({
            where: { id: Number(id) },
            data: { statut: 'actif' }
        });

        res.status(200).json({ message: 'Utilisateur débloqué avec succès', user: updatedUser });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors du déblocage de l\'utilisateur', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const exportUsers = async (req: Request, res: Response): Promise<void> => {
    const { format } = req.params;

    try {
        const clients = await prisma.utilisateur.findMany({
            where: { role: 'client' },
            include: { client: true }
        });

        if (format === 'csv') {
            await exportToCSV(clients, res);
        } else if (format === 'pdf') {
            await exportToPDF(clients, res);
        } else {
            res.status(400).json({ error: 'Format non supporté. Utilisez "csv" ou "pdf".' });
        }
    } catch (err) {
        console.error('Erreur lors de l\'exportation des utilisateurs:', err);
        res.status(500).json({ error: 'Erreur lors de l\'exportation des utilisateurs', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

const exportToCSV = async (clients: any[], res: Response): Promise<void> => {
    const filePath = path.join(__dirname, 'export.csv');
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'id', title: 'ID' },
            { id: 'nom', title: 'Nom' },
            { id: 'prenom', title: 'Prénom' },
            { id: 'email', title: 'Email' },
            { id: 'telephone', title: 'Téléphone' },
            { id: 'ville', title: 'Ville' },
            { id: 'codePostal', title: 'Code Postal' },
            { id: 'gouvernorat', title: 'Gouvernorat' },
        ],
    });

    const records = clients.map(user => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        ville: user.ville,
        codePostal: user.codePostal,
        gouvernorat: user.gouvernorat,
    }));

    try {
        await csvWriter.writeRecords(records);

        res.download(filePath, 'clients.csv', (err) => {
            if (err) {
                console.error('Erreur lors de l\'envoi du fichier CSV:', err);
                res.status(500).json({ error: 'Erreur lors de l\'envoi du fichier CSV' });
            }
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        console.error('Erreur lors de la génération du fichier CSV:', err);
        res.status(500).json({ error: 'Erreur lors de la génération du fichier CSV' });
    }
};
// Fonction pour exporter en PDF
const exportToPDF = async (clients: any[], res: Response): Promise<void> => {
    const filePath = path.join(__dirname, 'export.pdf'); // Chemin du fichier PDF
    const doc = new PDFDocument();

    // Écrire les clients
    doc.fontSize(14).text('Liste des Clients', { align: 'center' });
    clients.forEach((user, index) => {
        doc.fontSize(12).text(`${index + 1}. ${user.nom} ${user.prenom} - ${user.email}`);
        doc.fontSize(10).text(`Téléphone: ${user.telephone}, Ville: ${user.ville}`);
    });

    // Finaliser le PDF
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.end();

    // Attendre que le fichier soit entièrement écrit
    writeStream.on('finish', () => {
        // Définir les en-têtes de réponse
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="clients.pdf"');

        // Envoyer le fichier PDF en réponse
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);

        // Supprimer le fichier après l'envoi
        readStream.on('end', () => {
            fs.unlinkSync(filePath);
        });
    });

    writeStream.on('error', (err) => {
        console.error('Erreur lors de la génération du fichier PDF:', err);
        res.status(500).json({ error: 'Erreur lors de la génération du fichier PDF' });
    });
};

export const sendNotificationToAllClients = async (req: Request, res: Response): Promise<void> => {
    const { message } = req.body;

    if (!message) {
        res.status(400).json({ error: 'Le message de la notification est requis.' });
        return;
    }

    try {
        // Récupérer tous les clients
        const clients = await prisma.utilisateur.findMany({
            where: {
                role: 'client',
            },
        });

        // Configurer Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Envoyer un e-mail à chaque client et enregistrer la notification
        for (const client of clients) {
            const notification = await prisma.notification.create({
                data: {
                    message,
                    dateEnvoi: new Date(),
                    statut: 'non lu',
                    utilisateur_id: client.id,
                },
            });

            // Créer un lien unique pour marquer la notification comme lue
            const markAsReadLink = `http://localhost:3000/api/users/notifications/${notification.id}/mark-as-read`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: client.email,
                subject: 'Nouvelle Notification',
                html: `
                    <p>${message}</p>
                    <p><a href="${markAsReadLink}">Cliquez ici pour marquer cette notification comme lue</a></p>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Erreur lors de l'envoi de l'e-mail à ${client.email}:`, error);
                } else {
                    console.log(`E-mail envoyé à ${client.email}:`, info.response);
                }
            });
        }

        res.status(200).json({ message: 'Notifications envoyées à tous les clients avec succès.' });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur lors de l\'envoi des notifications:', err);
            res.status(500).json({ error: 'Erreur lors de l\'envoi des notifications', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de l\'envoi des notifications' });
        }
    }
};
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    const { notificationId } = req.params;

    if (!notificationId || isNaN(Number(notificationId))) {
        res.status(400).json({ error: 'ID de notification invalide ou manquant.' });
        return;
    }

    try {
        // Mettre à jour le statut de la notification
        const updatedNotification = await prisma.notification.update({
            where: { id: Number(notificationId) },
            data: { statut: 'lu' },
        });

        res.status(200).json({
            message: 'Notification marquée comme lue avec succès',
            notification: updatedNotification,
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la mise à jour de la notification' });
        }
    }
};

export const getClientsWhoReadNotification = async (req: Request, res: Response): Promise<void> => {
    const { message } = req.query;

    console.log('Message reçu:', message); // Log pour déboguer

    if (!message) {
        res.status(400).json({ error: 'Le message de la notification est requis.' });
        return;
    }

    try {
        // Récupérer les notifications avec le statut "lu" pour le message spécifié
        const readNotifications = await prisma.notification.findMany({
            where: {
                message: message as string,
                statut: 'lu',
            },
            include: {
                utilisateur: true, // Inclure les informations de l'utilisateur
            },
        });

        // Extraire les utilisateurs qui ont lu la notification
        const clientsWhoRead = readNotifications.map(notification => notification.utilisateur);

        res.status(200).json({ clients: clientsWhoRead });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des clients', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des clients' });
        }
    }
};
export const getClientsWhoDidNotReadNotification = async (req: Request, res: Response): Promise<void> => {
    const { message } = req.query;

    if (!message) {
        res.status(400).json({ error: 'Le message de la notification est requis.' });
        return;
    }

    try {
        // Récupérer tous les clients
        const allClients = await prisma.utilisateur.findMany({
            where: {
                role: 'client',
            },
        });

        // Récupérer les notifications avec le statut "lu" pour le message spécifié
        const readNotifications = await prisma.notification.findMany({
            where: {
                message: message as string,
                statut: 'lu',
            },
            include: {
                utilisateur: true, // Inclure les informations de l'utilisateur
            },
        });

        // Extraire les IDs des utilisateurs qui ont lu la notification
        const readClientIds = readNotifications.map(notification => notification.utilisateur.id);

        // Filtrer les clients qui n'ont pas lu la notification
        const clientsWhoDidNotRead = allClients.filter(client => !readClientIds.includes(client.id));

        res.status(200).json({ clients: clientsWhoDidNotRead });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des clients', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des clients' });
        }
    }
};
export const sendMessageToAdmin = async (req: Request, res: Response): Promise<void> => {
    const { utilisateur_id, contenu } = req.body;

    if (!utilisateur_id || !contenu) {
        res.status(400).json({ error: 'L\'ID de l\'utilisateur et le contenu du message sont requis.' });
        return;
    }

    try {
        // Vérifier si l'utilisateur existe et est un client
        const user = await prisma.utilisateur.findUnique({
            where: { id: utilisateur_id },
            include: { client: true },
        });

        if (!user || user.role !== 'client') {
            res.status(404).json({ error: 'Utilisateur non trouvé ou non autorisé.' });
            return;
        }

        // Enregistrer le message dans la table Messagerie
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
        // Vérifier si l'administrateur existe
        const admin = await prisma.utilisateur.findUnique({
            where: { id: admin_id },
            include: { admin: true },
        });

        if (!admin || admin.role !== 'admin') {
            res.status(404).json({ error: 'Administrateur non trouvé ou non autorisé.' });
            return;
        }

        // Vérifier si le message existe
        const originalMessage = await prisma.messagerie.findUnique({
            where: { id: message_id },
        });

        if (!originalMessage) {
            res.status(404).json({ error: 'Message non trouvé.' });
            return;
        }

        // Enregistrer la réponse dans la table Messagerie
        const replyMessage = await prisma.messagerie.create({
            data: {
                contenu,
                date_envoi: new Date(),
                utilisateur_id: admin_id,
                parent_message_id: message_id, // Lier la réponse au message original
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
        // Récupérer tous les messages du client (messages envoyés et réponses)
        const messages = await prisma.messagerie.findMany({
            where: {
                OR: [
                    { utilisateur_id: Number(utilisateur_id) }, // Messages envoyés par le client
                    { parent_message_id: { not: null }, utilisateur: { role: 'admin' } }, // Réponses de l'admin
                ],
            },
            include: {
                utilisateur: true, // Inclure les détails de l'utilisateur (client ou admin)
            },
            orderBy: {
                date_envoi: 'asc', // Trier par date d'envoi
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
        // Récupérer tous les messages (messages clients et réponses admin)
        const messages = await prisma.messagerie.findMany({
            include: {
                utilisateur: true, // Inclure les détails de l'utilisateur (client ou admin)
            },
            orderBy: {
                date_envoi: 'asc', // Trier par date d'envoi
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
const exportClientsToCSV = async (clientsWhoRead: any[], clientsWhoDidNotRead: any[], res: Response): Promise<void> => {
    const filePath = path.join(__dirname, 'clients_notification_status.csv');
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'id', title: 'ID' },
            { id: 'nom', title: 'Nom' },
            { id: 'prenom', title: 'Prénom' },
            { id: 'email', title: 'Email' },
            { id: 'statut', title: 'Statut' }, // Statut de la notification (lu ou non lu)
        ],
    });

    // Combiner les deux listes avec un statut
    const records = [
        ...clientsWhoRead.map(client => ({
            id: client.id,
            nom: client.nom,
            prenom: client.prenom,
            email: client.email,
            statut: 'lu',
        })),
        ...clientsWhoDidNotRead.map(client => ({
            id: client.id,
            nom: client.nom,
            prenom: client.prenom,
            email: client.email,
            statut: 'non lu',
        })),
    ];

    try {
        await csvWriter.writeRecords(records);

        res.download(filePath, 'clients_notification_status.csv', (err) => {
            if (err) {
                console.error('Erreur lors de l\'envoi du fichier CSV:', err);
                res.status(500).json({ error: 'Erreur lors de l\'envoi du fichier CSV' });
            }
            fs.unlinkSync(filePath); // Supprimer le fichier après l'envoi
        });
    } catch (err) {
        console.error('Erreur lors de la génération du fichier CSV:', err);
        res.status(500).json({ error: 'Erreur lors de la génération du fichier CSV' });
    }
};
const exportClientsToPDF = async (clientsWhoRead: any[], clientsWhoDidNotRead: any[], res: Response): Promise<void> => {
    const filePath = path.join(__dirname, 'clients_notification_status.pdf');
    const doc = new PDFDocument();

    // Écrire le titre
    doc.fontSize(14).text('Statut des notifications', { align: 'center' });

    // Écrire la section des clients qui ont lu la notification
    doc.fontSize(12).text('Clients ayant lu la notification:', { underline: true });
    clientsWhoRead.forEach((client, index) => {
        doc.fontSize(10).text(`${index + 1}. ${client.nom} ${client.prenom} - ${client.email}`);
    });

    // Ajouter un espace
    doc.moveDown();

    // Écrire la section des clients qui n'ont pas lu la notification
    doc.fontSize(12).text('Clients n\'ayant pas lu la notification:', { underline: true });
    clientsWhoDidNotRead.forEach((client, index) => {
        doc.fontSize(10).text(`${index + 1}. ${client.nom} ${client.prenom} - ${client.email}`);
    });

    // Finaliser le PDF
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.end();

    // Attendre que le fichier soit entièrement écrit
    writeStream.on('finish', () => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="clients_notification_status.pdf"');

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);

        // Supprimer le fichier après l'envoi
        readStream.on('end', () => {
            fs.unlinkSync(filePath);
        });
    });

    writeStream.on('error', (err) => {
        console.error('Erreur lors de la génération du fichier PDF:', err);
        res.status(500).json({ error: 'Erreur lors de la génération du fichier PDF' });
    });
};
export const exportNotificationStatus = async (req: Request, res: Response): Promise<void> => {
    const { message, format } = req.query;

    if (!message || !format) {
        res.status(400).json({ error: 'Le message de la notification et le format sont requis.' });
        return;
    }

    try {
        // Récupérer les clients qui ont lu la notification
        const readNotifications = await prisma.notification.findMany({
            where: {
                message: message as string,
                statut: 'lu',
            },
            include: {
                utilisateur: true,
            },
        });
        const clientsWhoRead = readNotifications.map(notification => notification.utilisateur);

        // Récupérer tous les clients
        const allClients = await prisma.utilisateur.findMany({
            where: {
                role: 'client',
            },
        });

        // Filtrer les clients qui n'ont pas lu la notification
        const readClientIds = clientsWhoRead.map(client => client.id);
        const clientsWhoDidNotRead = allClients.filter(client => !readClientIds.includes(client.id));

        // Exporter en fonction du format demandé
        if (format === 'csv') {
            await exportClientsToCSV(clientsWhoRead, clientsWhoDidNotRead, res);
        } else if (format === 'pdf') {
            await exportClientsToPDF(clientsWhoRead, clientsWhoDidNotRead, res);
        } else {
            res.status(400).json({ error: 'Format non supporté. Utilisez "csv" ou "pdf".' });
        }
    } catch (err) {
        console.error('Erreur lors de l\'exportation des données:', err);
        res.status(500).json({ error: 'Erreur lors de l\'exportation des données', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};