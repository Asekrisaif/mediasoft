import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createClient = async (req: Request, res: Response): Promise<void> => {
    const { nom, prenom, email, telephone, ville, codePostal, gouvernorat, motDePasse } = req.body;

    // Validation des données
    if (!nom || !prenom || !email || !telephone || !motDePasse) {
        res.status(400).json({ error: 'Tous les champs sont requis.' });
        return;
    }

    try {
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Création du client
        const client = await prisma.client.create({
            data: {
                soldePoints: 0,
                historiqueAchats: "Aucun historique",
                utilisateur: {
                    create: {
                        nom,
                        prenom,
                        email,
                        telephone,
                        ville,
                        codePostal,
                        gouvernorat,
                        motDePasse: hashedPassword,
                        role: "client",
                        statut: "actif"
                    }
                }
            },
            include: {
                utilisateur: true,
            },
        });

        res.status(201).json({ message: 'Client créé avec succès', data: client });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de la création du client', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};