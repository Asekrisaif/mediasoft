import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'; // Pour envoyer des emails
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
    res.json({
        msg: 'API fonctionnelle'
    });
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.utilisateur.findMany();
        res.json({ users });
    } catch (err) {
        // Typer l'erreur comme un objet Error
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des utilisateurs' });
        }
    }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
    const { nom, prenom, email, telephone, adresse, motDePasse, role } = req.body;

    if (!nom || !prenom || !email || !telephone || !adresse || !motDePasse || !role) {
        res.status(400).json({ error: 'Tous les champs sont requis.' });
        return;
    }

    try {
        // Hacher le mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const newUser = await prisma.utilisateur.create({
            data: {
                nom,
                prenom,
                email,
                telephone,
                adresse,
                motDePasse: hashedPassword, // Utiliser le mot de passe haché
                role,
                inscritLe: new Date()
            }
        });
        res.status(201).json({
            message: 'Utilisateur ajouté avec succès',
            user: newUser
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur.', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de l\'ajout de l\'utilisateur.' });
        }
    }
};

export const checkUser = async (req: Request, res: Response): Promise<void> => {
    const { email, motDePasse } = req.body;

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(404).json({ error: 'Compte incorrect' });
            return;
        }

        // Vérifier si le mot de passe est haché ou non
        const isPasswordHashed = user.motDePasse.startsWith('$2b$'); // Vérifie si le mot de passe commence par le préfixe de hachage bcrypt

        if (isPasswordHashed) {
            // Si le mot de passe est haché, utilisez bcrypt pour comparer
            const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);

            if (isPasswordValid) {
                res.json({
                    message: 'Compte correct',
                    user
                });
            } else {
                res.status(404).json({ error: 'Compte incorrect' });
            }
        } else {
            // Si le mot de passe n'est pas haché, comparez directement
            if (user.motDePasse === motDePasse) {
                res.json({
                    message: 'Compte correct',
                    user
                });
            } else {
                res.status(404).json({ error: 'Compte incorrect' });
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la vérification de l\'utilisateur', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la vérification de l\'utilisateur' });
        }
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide ou manquant.' });
        return;
    }

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { id: Number(id) } // Convertir l'ID en nombre
        });

        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération de l\'utilisateur' });
        }
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nom, prenom, email, telephone, adresse, motDePasse } = req.body;

    if (isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide' });
        return;
    }

    if (!nom || !prenom || !email || !telephone || !adresse || !motDePasse ) {
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
                adresse,
                motDePasse,
             
            }
        });
        res.status(200).json({
            message: 'Utilisateur mis à jour avec succès',
            user: updatedUser
        });
    } catch (err) {
        // Typer l'erreur comme un objet Error
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la mise à jour de l\'utilisateur' });
        }
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
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la recherche des utilisateurs', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la recherche des utilisateurs' });
        }
    }
};
/*export const changePassword = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide ou manquant.' });
        return;
    }

    if (!newPassword) {
        res.status(400).json({ error: 'Le nouveau mot de passe est requis.' });
        return;
    }

    try {
        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 est le coût du hachage

        // Mettre à jour le mot de passe dans la base de données
        const updatedUser = await prisma.utilisateur.update({
            where: { id: Number(id) },
            data: { motDePasse: hashedPassword }
        });

        res.status(200).json({
            message: 'Mot de passe mis à jour avec succès',
            user: updatedUser
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la mise à jour du mot de passe' });
        }
    }
};*/

// Fonction pour envoyer un email
const sendResetEmail = async (email: string, resetLink: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Utilisez un service de messagerie comme Gmail
        auth: {
            user: process.env.EMAIL_USER, // Votre adresse email
            pass: process.env.EMAIL_PASSWORD // Votre mot de passe email
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
        const user = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(404).json({ error: 'Utilisateur non trouvé.' });
            return;
        }

        const resetToken = generateResetToken();
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        // Enregistrez le token dans la base de données (par exemple, dans une table dédiée)
        await prisma.resetToken.create({
            data: {
                token: resetToken,
                utilisateur_id: user.id,
                expiresAt: new Date(Date.now() + 3600000) // Expire dans 1 heure
            }
        });

        // Envoyez l'email de réinitialisation
        await sendResetEmail(email, resetLink);

        res.status(200).json({ message: 'Un lien de réinitialisation a été envoyé à votre adresse email.' });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', err);
            res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la réinitialisation du mot de passe' });
        }
    }
};

// user.controller.ts
export const verifyResetToken = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        res.status(400).json({ error: 'Le token et le nouveau mot de passe sont requis.' });
        return;
    }

    try {
        // Vérifier si le token existe et n'a pas expiré
        const resetToken = await prisma.resetToken.findFirst({
            where: {
                token,
                expiresAt: { gt: new Date() } // Vérifier que le token n'a pas expiré
            }
        });

        if (!resetToken) {
            res.status(400).json({ error: 'Token invalide ou expiré.' });
            return;
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe de l'utilisateur
        await prisma.utilisateur.update({
            where: { id: resetToken.utilisateur_id },
            data: { motDePasse: hashedPassword }
        });

        // Supprimer le token après utilisation
        await prisma.resetToken.delete({
            where: { id: resetToken.id }
        });

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur lors de la vérification du token:', err);
            res.status(500).json({ error: 'Erreur lors de la vérification du token', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la vérification du token' });
        }
    }
};
// user.controller.ts
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: 'L\'email est requis.' });
        return;
    }

    try {
        // Vérifier si l'email existe dans la base de données
        const user = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (!user) {
            // Si l'email n'existe pas, renvoyer un message d'erreur
            res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet email.' });
            return;
        }

        // Générer un token de réinitialisation
        const resetToken = generateResetToken();
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        // Enregistrer le token dans la base de données
        await prisma.resetToken.create({
            data: {
                token: resetToken,
                utilisateur_id: user.id,
                expiresAt: new Date(Date.now() + 3600000) // Expire dans 1 heure
            }
        });

        // Envoyer l'email de réinitialisation
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Votre adresse email
                pass: process.env.EMAIL_PASSWORD // Votre mot de passe email
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
        if (err instanceof Error) {
            console.error('Erreur lors de l\'envoi de l\'email:', err);
            res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de l\'envoi de l\'email' });
        }
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

        res.status(200).json({
            message: 'Utilisateur bloqué avec succès',
            user: updatedUser
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors du blocage de l\'utilisateur', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors du blocage de l\'utilisateur' });
        }
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

        res.status(200).json({
            message: 'Utilisateur débloqué avec succès',
            user: updatedUser
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors du déblocage de l\'utilisateur', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors du déblocage de l\'utilisateur' });
        }
    }
};

export const exportUsers = async (req: Request, res: Response): Promise<void> => {
    const { format } = req.params; // Récupérer le format (CSV ou PDF)

    try {
        // Récupérer uniquement les utilisateurs avec le rôle "client"
        const clients = await prisma.utilisateur.findMany({
            where: {
                role: 'client', // Filtrer par rôle "client"
            },
            include: {
                client: true, // Inclure les détails du client si nécessaire
            },
        });

        // Exporter selon le format demandé
        if (format === 'csv') {
            await exportToCSV(clients, res); // Passer uniquement les clients
        } else if (format === 'pdf') {
            await exportToPDF(clients, res); // Passer uniquement les clients
        } else {
            res.status(400).json({ error: 'Format non supporté. Utilisez "csv" ou "pdf".' });
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur lors de l\'exportation des utilisateurs:', err);
            res.status(500).json({ error: 'Erreur lors de l\'exportation des utilisateurs', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de l\'exportation des utilisateurs' });
        }
    }
};

// Fonction pour exporter en CSV
const exportToCSV = async (clients: any[], res: Response): Promise<void> => {
    const filePath = path.join(__dirname, 'export.csv'); // Chemin du fichier CSV
    const csvWriter = createObjectCsvWriter({
        path: filePath, // Utiliser le chemin absolu
        header: [
            { id: 'id', title: 'ID' },
            { id: 'nom', title: 'Nom' },
            { id: 'prenom', title: 'Prénom' },
            { id: 'email', title: 'Email' },
            { id: 'telephone', title: 'Téléphone' },
            { id: 'adresse', title: 'Adresse' },
        ],
    });

    const records = clients.map(user => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        adresse: user.adresse,
    }));

    try {
        await csvWriter.writeRecords(records);

        // Envoyer le fichier CSV en réponse
        res.download(filePath, 'clients.csv', (err) => {
            if (err) {
                console.error('Erreur lors de l\'envoi du fichier CSV:', err);
                res.status(500).json({ error: 'Erreur lors de l\'envoi du fichier CSV' });
            }
            // Supprimer le fichier après l'envoi
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
        doc.fontSize(10).text(`Téléphone: ${user.telephone}, Adresse: ${user.adresse}`);
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
                role: 'client' // Filtrer par rôle "client"
            }
        });

        // Envoyer une notification à chaque client
        const notifications = clients.map(client => ({
            message,
            dateEnvoi: new Date(),
            statut: 'non lu', // Par défaut, la notification est "non lue"
            utilisateur_id: client.id
        }));

        // Créer les notifications en base de données
        await prisma.notification.createMany({
            data: notifications
        });

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
            data: { statut: 'lu' }
        });

        res.status(200).json({
            message: 'Notification marquée comme lue avec succès',
            notification: updatedNotification
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
export const getClientNotifications = async (req: Request, res: Response): Promise<void> => {
    const { clientId } = req.params;

    if (!clientId || isNaN(Number(clientId))) {
        res.status(400).json({ error: 'ID de client invalide ou manquant.' });
        return;
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                utilisateur_id: Number(clientId)
            },
            orderBy: {
                dateEnvoi: 'desc' // Trier par date d'envoi décroissante
            }
        });

        res.status(200).json({ notifications });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des notifications', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des notifications' });
        }
    }
};