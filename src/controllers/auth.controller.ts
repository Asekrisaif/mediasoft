import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'; // Ajout de l'import manquant

const prisma = new PrismaClient();

const generateResetToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

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
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
        res.status(400).json({ error: 'Email et mot de passe sont requis' });
        return;
    }

    try {
        // Trouver l'utilisateur par email
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { email },
            include: { client: true }
        });

        if (!utilisateur) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

        if (!motDePasseValide) {
            res.status(401).json({ error: 'Mot de passe incorrect' });
            return;
        }

        // Vérifier si c'est bien un client
        if (!utilisateur.client) {
            res.status(403).json({ error: 'Accès réservé aux clients' });
            return;
        }

        // Créer un token JWT
        const token = jwt.sign(
            { 
                id: utilisateur.id, 
                role: utilisateur.role,
                clientId: utilisateur.client.id 
            },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        // Renvoyer les informations du client avec le token
        res.status(200).json({
            token,
            client: {
                id: utilisateur.client.id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                telephone: utilisateur.telephone,
                soldePoints: utilisateur.client.soldePoints
            }
        });

    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};
