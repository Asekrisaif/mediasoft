import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

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
