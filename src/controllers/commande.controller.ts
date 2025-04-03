import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia' as const
});

export const validatePanierAndCreateCommande = async (req: Request, res: Response): Promise<void> => {
    const { panier_id, utiliserPoints, paymentMethod, livrerDomicile } = req.body;

    try {
        const panier = await prisma.panier.findUnique({
            where: { id: panier_id },
            include: {
                lignePanier: { include: { produit: true } },
                client: { include: { utilisateur: true } }
            }
        });

        if (!panier) {
            res.status(404).json({ error: 'Panier non trouvé' });
            return;
        }

        const remise = panier.remise || 0;
        const fraisLivraison = livrerDomicile ? 8 : 0;
        const totalAPayer = panier.total - remise + fraisLivraison;

        const commande = await prisma.commande.create({
            data: {
                total: panier.total,
                client_id: panier.client_id,
                remise: remise,
                montantLivraison: fraisLivraison,
                montantAPayer: totalAPayer,
                panier_id: panier.id,
                montantPoint: 0,
                dateLivraison: new Date(),
                pointsGagnes: 0,
                pointsUtilises: 0,
                livraison: {
                    create: {
                        date: new Date(),
                        nomLivreur: "",
                        statutLivraison: "en_attente",
                        detailPaiement: ""
                    }
                }
            },
            include: {
                livraison: true
            }
        });


        if (paymentMethod === 'carte') {
            // Paiement par carte - créer le paiement immédiatement
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round((panier.total - remise + fraisLivraison) * 100),
                currency: 'eur',
                metadata: { commande_id: commande.id },
                description: `Commande #${commande.id}`
            });

            // Mettre à jour la livraison pour indiquer que le paiement est fait
            await prisma.livraison.update({
                where: { id: commande.livraison[0].id },
                data: {
                    statutLivraison: "en_preparation"
                }
            });

            res.status(200).json({ 
                paymentRequired: true,
                redirectUrl: `/payment-form?clientSecret=${paymentIntent.client_secret}&commandeId=${commande.id}&amount=${paymentIntent.amount / 100}`
            });
        } else {
            // Paiement en espèces - ne pas créer de paiement pour l'instant
            const commandeWithRelations = await prisma.commande.findUnique({
                where: { id: commande.id },
                include: {
                    client: { include: { utilisateur: true } },
                    panier: { include: { lignePanier: { include: { produit: true } } } },
                    livraison: true
                }
            });

            if (!commandeWithRelations) {
                throw new Error('Commande non trouvée');
            }

            const pdfBuffer = await generateInvoicePDF(commandeWithRelations, commandeWithRelations.client, commandeWithRelations.panier);
            
            // Enregistrer le PDF
            const invoicesDir = path.join(__dirname, '..', '..', 'invoices');
            if (!fs.existsSync(invoicesDir)) {
                fs.mkdirSync(invoicesDir, { recursive: true });
            }
            const invoicePath = path.join(invoicesDir, `facture-${commande.id}.pdf`);
            fs.writeFileSync(invoicePath, pdfBuffer);

            res.status(200)
               .setHeader('Content-Type', 'application/pdf')
               .setHeader('Content-Disposition', `attachment; filename=facture-${commande.id}.pdf`)
               .send(pdfBuffer);
        }

    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ 
            error: 'Erreur lors de la création de la commande',
            details: err instanceof Error ? err.message : 'Erreur inconnue'
        });
    }
};

export const confirmLivraison = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres d'URL
    const { montant, methode, details } = req.body;

    // Validation de base
    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID de commande invalide' });
        return;
    }

    if (!montant || !methode) {
        res.status(400).json({ error: 'Les champs montant et methode sont requis' });
        return;
    }

    try {
        // Vérifier si la commande existe
        const commande = await prisma.commande.findUnique({
            where: { id: Number(id) },
            include: { livraison: true }
        });

        if (!commande) {
            res.status(404).json({ error: 'Commande non trouvée' });
            return;
        }

        // Vérifier qu'il y a une livraison associée
        if (!commande.livraison || commande.livraison.length === 0) {
            res.status(400).json({ error: 'Aucune livraison associée à cette commande' });
            return;
        }

        // Mettre à jour la livraison
        await prisma.livraison.update({
            where: { id: commande.livraison[0].id },
            data: {
                statutLivraison: "livrée",
                date: new Date(),
                detailPaiement: `Paiement ${methode} reçu`,
                nomLivreur: details?.nomLivreur || "Non spécifié"
            }
        });

        // Enregistrer le paiement si c'est un paiement en espèces
        if (methode === 'espece') {
            await prisma.paiement.create({
                data: {
                    montant: Number(montant),
                    methode: methode,
                    statut: "payé",
                    commande_id: Number(id),
                    date: new Date(),
                    detailsCarte: ""
                }
            });
        }

        res.status(200).json({ 
            message: 'Livraison confirmée avec succès',
            commandeId: id,
            livraisonId: commande.livraison[0].id
        });

    } catch (err) {
        console.error('Erreur détaillée:', {
            error: err,
            body: req.body,
            params: req.params
        });
        
        res.status(500).json({ 
            error: 'Erreur lors de la confirmation de la livraison',
            details: err instanceof Error ? err.message : 'Erreur inconnue'
        });
    }
};

export const confirmCardPayment = async (req: Request, res: Response): Promise<void> => {
    const { commande_id, paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
            expand: ['payment_method']
        });

        if (paymentIntent.status !== 'succeeded') {
            res.status(400).json({ error: 'Paiement non confirmé' });
            return;
        }

        const paymentMethod = paymentIntent.payment_method as Stripe.PaymentMethod;
        const cardDetails = paymentMethod?.card;

        const commande = await prisma.commande.update({
            where: { id: commande_id },
            data: {
                paiement: {
                    create: {
                        montant: paymentIntent.amount / 100,
                        methode: 'carte',
                        detailsCarte: cardDetails ? {
                            last4: cardDetails.last4,
                            brand: cardDetails.brand,
                            exp_month: cardDetails.exp_month,
                            exp_year: cardDetails.exp_year
                        } : undefined,
                        statut: 'payé'
                    }
                }
            },
            include: {
                client: { include: { utilisateur: true } },
                panier: { include: { lignePanier: { include: { produit: true } } } },
                paiement: true
            }
        });

        const pdfBuffer = await generateInvoicePDF(commande, commande.client, commande.panier);
        
        res.status(200)
           .setHeader('Content-Type', 'application/pdf')
           .setHeader('Content-Disposition', `attachment; filename=facture-${commande.id}.pdf`)
           .send(pdfBuffer);

    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ error: 'Erreur lors de la confirmation du paiement' });
    }
};

export const downloadInvoice = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
        const commande = await prisma.commande.findUnique({
            where: { id: Number(id) },
            include: {
                client: { include: { utilisateur: true } },
                panier: { 
                    include: { 
                        lignePanier: { include: { produit: true } } 
                    } 
                },
                paiement: true
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