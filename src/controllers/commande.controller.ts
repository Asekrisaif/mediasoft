import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { notifyAdminLowStock } from '../utils/notifyAdmin'; // Assurez-vous que le chemin est correct

const prisma = new PrismaClient();

export const validatePanierAndCreateCommande = async (req: Request, res: Response): Promise<void> => {
    const { panier_id } = req.body;

    try {
        // Vérifier si le panier existe
        const panier = await prisma.panier.findUnique({
            where: { id: panier_id },
            include: { lignePanier: true },
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

        // Mettre à jour le stock des produits
        for (const ligne of panier.lignePanier) {
            const produit = await prisma.produit.findUnique({
                where: { id: ligne.produit_id },
            });

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

            // Vérifier si le stock est inférieur ou égal au seuil minimum
            if (newStock <= produit.seuilMin) {
                await notifyAdminLowStock(produit); // Envoyer une notification aux admins
            }
        }

        // Créer la commande
        const commande = await prisma.commande.create({
            data: {
                client_id: panier.client_id,
                panier_id: panier.id,
                total: panier.total,
                remise: 0, // Valeur par défaut ou calculée
                montantPoint: 0, // Valeur par défaut ou calculée
                montantLivraison: 0, // Valeur par défaut ou calculée
                montantAPayer: panier.total, // Valeur par défaut ou calculée
                dateLivraison: new Date(), // Date de livraison par défaut
            },
        });

        res.status(201).json({ message: 'Commande créée avec succès', data: commande });
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