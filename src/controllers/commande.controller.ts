import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';

const prisma = new PrismaClient();

export const validatePanierAndCreateCommande = async (req: Request, res: Response): Promise<void> => {
    const { panier_id, utiliserPoints } = req.body;

    try {
        // 1. Récupérer le panier avec les informations nécessaires
        const panier = await prisma.panier.findUnique({
            where: { id: panier_id },
            include: {
                lignePanier: {
                    include: { produit: true }
                },
                client: {
                    include: { utilisateur: true }
                }
            }
        });

        if (!panier) {
            res.status(404).json({ error: 'Panier non trouvé.' });
            return;
        }

        // 2. Calculer le total des points du panier
        let totalPointsPanier = 0;
        for (const ligne of panier.lignePanier) {
            totalPointsPanier += ligne.produit.nbrPoint * ligne.qteCmd;
            
            // Vérifier le stock
            if (ligne.produit.qteStock < ligne.qteCmd) {
                res.status(400).json({ 
                    error: `Stock insuffisant pour ${ligne.produit.designation}` 
                });
                return;
            }
        }

        // 3. Nouvelle logique de réduction basée sur les points
        let remise = 0;
        let pointsUtilises = 0;

        if (utiliserPoints && panier.client.soldePoints >= 100) {
            const lotsDe100Points = Math.floor(panier.client.soldePoints / 100);
            const pourcentageRemise = Math.min(lotsDe100Points * 10, 50);
            remise = panier.total * (pourcentageRemise / 100);
            pointsUtilises = Math.min(lotsDe100Points, 5) * 100;
        }

        // 4. Mettre à jour les stocks des produits
        for (const ligne of panier.lignePanier) {
            await prisma.produit.update({
                where: { id: ligne.produit_id },
                data: { 
                    qteStock: { decrement: ligne.qteCmd } 
                }
            });
        }

        // 5. Mettre à jour le solde de points du client
        const nouveauSolde = panier.client.soldePoints + totalPointsPanier - pointsUtilises;

        const nouvelHistorique = {
            date: new Date(),
            pointsGagnes: totalPointsPanier,
            pointsUtilises: pointsUtilises,
            montant: panier.total - remise,
            remiseAppliquee: remise > 0 ? `${(remise / panier.total * 100).toFixed(0)}%` : "Aucune"
        };

        await prisma.client.update({
            where: { id: panier.client_id },
            data: {
                soldePoints: nouveauSolde,
                historiqueAchats: nouvelHistorique
            }
        });

        // 6. Créer la commande
        const commande = await prisma.commande.create({
            data: {
                client_id: panier.client_id,
                panier_id: panier.id,
                total: panier.total,
                remise,
                montantPoint: totalPointsPanier,
                pointsUtilises,
                montantLivraison: 0,
                montantAPayer: panier.total - remise,
                dateLivraison: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                pointsGagnes: totalPointsPanier
            }
        });

        // 7. Générer le PDF et envoyer la réponse
        const pdfBuffer = await generateInvoicePDF(commande, panier.client, panier);

        // Ajouter les données JSON dans les en-têtes
        res.setHeader('X-Commande-Data', JSON.stringify({
            message: 'Commande créée avec succès',
            data: {
                commande,
                pointsGagnes: totalPointsPanier,
                pointsUtilises,
                nouveauSolde,
                remiseAppliquee: remise > 0 ? `${(remise / panier.total * 100).toFixed(0)}%` : "Aucune",
                montantFinal: panier.total - remise
            }
        }));

        // Envoyer le PDF en réponse
        res.status(201)
           .setHeader('Content-Type', 'application/pdf')
           .setHeader('Content-Disposition', `attachment; filename=facture-${commande.id}.pdf`)
           .send(pdfBuffer);

    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ 
            error: 'Erreur lors de la création de la commande',
            details: err instanceof Error ? err.message : 'Erreur inconnue'
        });
    } finally {
        await prisma.$disconnect();
    }
};

export const downloadInvoice = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
        const commande = await prisma.commande.findUnique({
            where: { id: Number(id) },
            include: {
                client: { include: { utilisateur: true } },
                panier: { include: { lignePanier: { include: { produit: true } } }}
            }
        });

        if (!commande) {
            res.status(404).json({ error: 'Commande non trouvée' });
            return;
        }

        const pdfBuffer = await generateInvoicePDF(commande, commande.client, commande.panier);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=facture-${commande.id}.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la génération de la facture' });
    }
};