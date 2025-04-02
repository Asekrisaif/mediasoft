import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Créer une nouvelle livraison
export const createLivraison = async (req: Request, res: Response): Promise<void> => {
    const { commande_id, nomLivreur, statutLivraison, detailPaiement } = req.body;

    try {
        // Vérifier que la commande existe
        const commande = await prisma.commande.findUnique({
            where: { id: commande_id }
        });

        if (!commande) {
            res.status(404).json({ error: 'Commande non trouvée' });
            return;
        }

        const livraison = await prisma.livraison.create({
            data: {
                date: new Date(),
                nomLivreur,
                statutLivraison,
                detailPaiement,
                commande_id
            }
        });

        res.status(201).json(livraison);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la livraison' });
    }
};

// Récupérer toutes les livraisons
export const getAllLivraisons = async (req: Request, res: Response): Promise<void> => {
    try {
        const livraisons = await prisma.livraison.findMany({
            include: {
                commande: {
                    include: {
                        client: {
                            include: {
                                utilisateur: true
                            }
                        },
                        panier: {
                            include: {
                                lignePanier: {
                                    include: {
                                        produit: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        const formattedLivraisons = livraisons.map(liv => ({
            id: liv.id,
            date: liv.date,
            nomLivreur: liv.nomLivreur,
            statutLivraison: liv.statutLivraison,
            detailPaiement: liv.detailPaiement,
            commande: {
                id: liv.commande.id,
                client: {
                    id: liv.commande.client.id,
                    nom: liv.commande.client.utilisateur.nom,
                    prenom: liv.commande.client.utilisateur.prenom
                },
                montantTotal: liv.commande.montantAPayer,
                produits: liv.commande.panier.lignePanier.map(lp => ({
                    designation: lp.produit.designation,
                    quantite: lp.qteCmd
                }))
            }
        }));

        res.status(200).json(formattedLivraisons);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des livraisons' });
    }
};

// Mettre à jour une livraison
export const updateLivraison = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nomLivreur, statutLivraison, detailPaiement } = req.body;

    try {
        const livraison = await prisma.livraison.update({
            where: { id: parseInt(id) },
            data: {
                nomLivreur,
                statutLivraison,
                detailPaiement,
                date: new Date()
            }
        });

        res.status(200).json(livraison);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la livraison' });
    }
};