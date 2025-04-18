import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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



