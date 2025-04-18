import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Added missing import for crypto

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

// Added missing sendVerificationEmail function
const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const verificationLink = `${process.env.BACKEND_URL}:${process.env.PORT}/verify-email?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Vérification de votre adresse email',
        text: `Cliquez sur ce lien pour vérifier votre adresse email: ${verificationLink}`
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
        const resetLink = `${process.env.BACKEND_URL}:${process.env.PORT}/reset-password?token=${resetToken}`;

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
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { email },
            include: { client: true }
        });

        if (!utilisateur) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }

        // Check if the email is verified
        if (!utilisateur.emailVerified) {
            res.status(403).json({
                error: 'Votre email n\'est pas vérifié',
                emailVerified: false,
                email: utilisateur.email
            });
            return;
        }

        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

        if (!motDePasseValide) {
            res.status(401).json({ error: 'Mot de passe incorrect' });
            return;
        }

        // Check if the client exists
        if (!utilisateur.client) {
            res.status(403).json({ error: 'Accès réservé aux clients' });
            return;
        }

        const token = jwt.sign(
            {
                id: utilisateur.id,
                role: utilisateur.role,
                clientId: utilisateur.client.id
            },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

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

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;

    if (!token) {
        res.status(400).json({ 
            success: false,
            error: 'Token manquant',
            redirectUrl: `${process.env.FRONTEND_URL}/auth/signin?verified=false`
        });
        return;
    }

    try {
        const user = await prisma.utilisateur.findFirst({
            where: { 
                verificationToken: token as string,
                verificationTokenExpires: { gt: new Date() }
            }
        });

        if (!user) {
            res.status(400).json({ 
                success: false,
                error: 'Token invalide ou expiré',
                redirectUrl: `${process.env.FRONTEND_URL}/auth/signin?verified=false`
            });
            return;
        }

        await prisma.utilisateur.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationTokenExpires: null,
                statut: 'actif'
            }
        });

        res.status(200).json({ 
            success: true,
            redirectUrl: `${process.env.FRONTEND_URL}/auth/signin?verified=true`
        });
        
    } catch (err) {
        console.error('Erreur lors de la vérification:', err);
        res.status(500).json({ 
            success: false,
            error: 'Erreur lors de la vérification',
            redirectUrl: `${process.env.FRONTEND_URL}/auth/signin?verified=false`
        });
    }
};
export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.emailVerified) {
            res.status(400).json({ error: 'Email already verified' });
            return;
        }

        // Générer un nouveau token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 heure

        await prisma.utilisateur.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationTokenExpires
            }
        });

        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({ 
            message: 'Verification email resent successfully' 
        });
    } catch (err) {
        console.error('Error resending verification email:', err);
        res.status(500).json({ error: 'Error resending verification email' });
    }
};
export const checkEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.query;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { email: email as string }
        });

        res.status(200).json({ available: !user });
    } catch (err) {
        console.error('Error checking email:', err);
        res.status(500).json({ error: 'Error checking email availability' });
    }
};
