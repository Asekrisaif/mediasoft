import { Request, Response } from "express";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Type personnalisé pour les erreurs Prisma
type PrismaError = Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError | Prisma.PrismaClientValidationError;

export const createAvis = async (req: Request, res: Response): Promise<void> => {
    const { note, commentaire, utilisateur_id } = req.body;

    if (!note || !utilisateur_id) {
        res.status(400).json({ error: 'Les champs note et utilisateur_id sont obligatoires' });
        return;
    }

    try {
        const userExists = await prisma.utilisateur.findUnique({
            where: { id: Number(utilisateur_id) }
        });

        if (!userExists) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }

        const avis = await prisma.avis.create({
            data: {
                date: new Date(),
                note: Number(note),
                commentaire: commentaire || null,
                utilisateur_id: Number(utilisateur_id)
            },
            include: {
                utilisateur: {
                    select: {
                        nom: true,
                        prenom: true
                    }
                }
            }
        });

        res.status(201).json({ message: 'Avis créé avec succès', data: avis });
    } catch (error: unknown) {
        console.error('Erreur lors de la création de l\'avis:', error);
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                res.status(409).json({ error: 'Cet utilisateur a déjà posté un avis' });
                return;
            }
            if (error.code === 'P2003') {
                res.status(400).json({ error: 'ID utilisateur invalide' });
                return;
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ 
            error: 'Erreur lors de la création de l\'avis',
            details: process.env.NODE_ENV === 'development' ? errorMessage : null
        });
    }
};

// Récupérer tous les avis
export const getAllAvis = async (req: Request, res: Response): Promise<void> => {
    try {
        const avis = await prisma.avis.findMany({
            include: {
                utilisateur: {
                    select: {
                        nom: true,
                        prenom: true,
                        email: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        res.status(200).json({ data: avis });
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération des avis:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des avis',
            details: process.env.NODE_ENV === 'development' ? errorMessage : null
        });
    }
};

// Récupérer un avis par ID
export const getAvisById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const avis = await prisma.avis.findUnique({
            where: { id: Number(id) },
            include: {
                utilisateur: {
                    select: {
                        nom: true,
                        prenom: true,
                        email: true
                    }
                }
            }
        });

        if (!avis) {
            res.status(404).json({ error: 'Avis non trouvé' });
            return;
        }

        res.status(200).json({ data: avis });
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération de l\'avis:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ 
            error: 'Erreur lors de la récupération de l\'avis',
            details: process.env.NODE_ENV === 'development' ? errorMessage : null
        });
    }
};

// Mettre à jour un avis
export const updateAvis = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { note, commentaire } = req.body;

    try {
        const updatedAvis = await prisma.avis.update({
            where: { id: Number(id) },
            data: {
                note,
                commentaire
            },
            include: {
                utilisateur: {
                    select: {
                        nom: true,
                        prenom: true,
                        email: true
                    }
                }
            }
        });

        res.status(200).json({ message: 'Avis mis à jour avec succès', data: updatedAvis });
    } catch (error: unknown) {
        console.error('Erreur lors de la mise à jour de l\'avis:', error);
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: 'Avis non trouvé' });
                return;
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ 
            error: 'Erreur lors de la mise à jour de l\'avis',
            details: process.env.NODE_ENV === 'development' ? errorMessage : null
        });
    }
};

// Supprimer un avis
export const deleteAvis = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await prisma.avis.delete({
            where: { id: Number(id) }
        });

        res.status(200).json({ message: 'Avis supprimé avec succès' });
    } catch (error: unknown) {
        console.error('Erreur lors de la suppression de l\'avis:', error);
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: 'Avis non trouvé' });
                return;
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ 
            error: 'Erreur lors de la suppression de l\'avis',
            details: process.env.NODE_ENV === 'development' ? errorMessage : null
        });
    }
};

// Statistiques des avis
export const getAvisStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalAvis = await prisma.avis.count();
        const averageRating = await prisma.avis.aggregate({
            _avg: {
                note: true
            }
        });
        const ratingDistribution = await prisma.avis.groupBy({
            by: ['note'],
            _count: {
                note: true
            },
            orderBy: {
                note: 'asc'
            }
        });

        res.status(200).json({
            data: {
                totalAvis,
                averageRating: averageRating._avg.note,
                ratingDistribution
            }
        });
    } catch (error: unknown) {
        console.error('Erreur lors de la récupération des statistiques des avis:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des statistiques des avis',
            details: process.env.NODE_ENV === 'development' ? errorMessage : null
        });
    }
};