import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';

const prisma = new PrismaClient();

export const validatePanierAndCreateCommande = async (req: Request, res: Response): Promise<void> => {
    const { panier_id, utiliserPoints } = req.body;

    try {
        // Vérifier si le panier existe
        const panier = await prisma.panier.findUnique({
            where: { id: panier_id },
            include: {
                lignePanier: {
                    include: {
                        produit: true,
                    },
                },
                client: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });

        if (!panier) {
            res.status(404).json({ error: 'Panier non trouvé.' });
            return;
        }

        // Vérifier si le panier est vide
        if (panier.lignePanier.length === 0) {
            res.status(400).json({ error: 'Le panier est vide.' });
            return;
        }

        // Mettre à jour le stock des produits et calculer le total des points
        let totalPoints = 0;
        for (const ligne of panier.lignePanier) {
            const produit = ligne.produit;

            if (!produit) {
                res.status(404).json({ error: `Produit avec ID ${ligne.produit_id} non trouvé.` });
                return;
            }

            const newStock = produit.qteStock - ligne.qteCmd;

            if (newStock < 0) {
                res.status(400).json({ error: `Stock insuffisant pour le produit ${produit.designation}.` });
                return;
            }

            await prisma.produit.update({
                where: { id: ligne.produit_id },
                data: { qteStock: newStock },
            });

            // Ajouter les points du produit au total des points
            totalPoints += produit.nbrPoint * ligne.qteCmd;
        }

        // Mettre à jour le solde de points du client
        const updatedClient = await prisma.client.update({
            where: { id: panier.client_id },
            data: {
                soldePoints: {
                    increment: totalPoints,
                },
            },
        });

        // Enregistrer l'achat dans l'historique des achats
        const historiqueAchat = panier.lignePanier.map((ligne) => ({
            produit: ligne.produit.designation,
            quantite: ligne.qteCmd,
            prixUnitaire: ligne.prix,
            sousTotal: ligne.sousTotal,
        }));

        await prisma.client.update({
            where: { id: panier.client_id },
            data: {
                historiqueAchats: JSON.stringify(historiqueAchat),
            },
        });

        // Appliquer une réduction si le client utilise ses points
        let remise = 0;
        if (utiliserPoints && updatedClient.soldePoints >= 100) {
            remise = panier.total * 0.1;
            await prisma.client.update({
                where: { id: panier.client_id },
                data: {
                    soldePoints: {
                        decrement: 100,
                    },
                },
            });
        }

        // Créer la commande
        const commande = await prisma.commande.create({
            data: {
                client_id: panier.client_id,
                panier_id: panier.id,
                total: panier.total - remise,
                remise,
                montantPoint: totalPoints,
                montantLivraison: 0,
                montantAPayer: panier.total - remise,
                dateLivraison: new Date(),
            },
        });

        // Générer et envoyer le PDF de facture
        await generateInvoicePDF(commande, panier.client, panier, res);

    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la création de la commande', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la création de la commande' });
        }
    }
};