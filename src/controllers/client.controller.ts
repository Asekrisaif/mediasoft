import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createClient = async (req: Request, res: Response): Promise<void> => {
    const { nom, prenom, email, telephone, ville, codePostal, gouvernorat, motDePasse } = req.body;

    // Validation des données
    if (!nom || !prenom || !email || !telephone || !motDePasse) {
        res.status(400).json({ error: 'Tous les champs obligatoires sont requis.' });
        return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Format d\'email invalide' });
        return;
    }

    try {
        // Vérifier si l'email existe déjà
        const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'Cet email est déjà utilisé' });
            return;
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Création du client
        const client = await prisma.client.create({
            data: {
                soldePoints: 0,
                historiqueAchats: "[]",
                historiquePoints: "[]",
                utilisateur: {
                    create: {
                        nom,
                        prenom,
                        email,
                        telephone,
                        ville: ville || "",
                        codePostal: codePostal || "",
                        gouvernorat: gouvernorat || "",
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

        // Ne pas renvoyer le mot de passe dans la réponse
        const { motDePasse: _, ...userWithoutPassword } = client.utilisateur;

        res.status(201).json({ 
            message: 'Client créé avec succès', 
            data: {
                ...client,
                utilisateur: userWithoutPassword
            } 
        });
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ 
            error: 'Erreur lors de la création du client', 
            details: process.env.NODE_ENV === 'development' ? err : undefined 
        });
    }
};
// Nouvelle fonction pour récupérer l'historique des achats
export const getHistoriqueAchats = async (req: Request, res: Response): Promise<void> => {
    const { clientId } = req.params;

    try {
        // Récupérer les commandes du client avec les détails nécessaires
        const commandes = await prisma.commande.findMany({
            where: { client_id: parseInt(clientId) },
            include: {
                panier: {
                    include: {
                        lignePanier: {
                            include: {
                                produit: true
                            }
                        }
                    }
                },
                livraison: true
            },
            orderBy: {
                id: 'desc' // Pour avoir les commandes les plus récentes en premier
            }
        });

        if (!commandes || commandes.length === 0) {
            res.status(404).json({ message: 'Aucun historique d\'achat trouvé pour ce client' });
            return;
        }

        // Formater les données pour la réponse
        const historique = commandes.map(commande => {
            const produits = commande.panier.lignePanier.map(ligne => ({
                id: ligne.produit.id,
                designation: ligne.produit.designation,
                quantite: ligne.qteCmd,
                prixUnitaire: ligne.prix,
                total: ligne.sousTotal,
                points: ligne.produit.nbrPoint * ligne.qteCmd,
                image: ligne.produit.images[0] // Première image du produit
            }));

            const totalProduits = produits.reduce((sum, prod) => sum + prod.total, 0);
            const totalPoints = produits.reduce((sum, prod) => sum + prod.points, 0);

            return {
                id: commande.id,
                date: commande.panier.date,
                produits,
                remise: commande.pourcentageRemise || 0,
                montantLivraison: commande.montantLivraison,
                montantTotal: commande.montantAPayer,
                pointsUtilises: commande.pointsUtilises,
                pointsGagnes: commande.pointsGagnes,
                statutLivraison: commande.livraison[0]?.statutLivraison || 'En attente',
                detailsLivraison: commande.livraison[0] || null
            };
        });

        res.status(200).json(historique);
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
};
// Fonction pour mettre à jour l'historique dans le JSON (optionnel)
export const updateHistoriqueClient = async (clientId: number, nouvelleCommande: any) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: clientId }
        });

        let historique = client?.historiqueAchats ? JSON.parse(client.historiqueAchats.toString()) : [];
        historique.push(nouvelleCommande);

        await prisma.client.update({
            where: { id: clientId },
            data: {
                historiqueAchats: JSON.stringify(historique)
            }
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'historique:', err);
    }
};
// Nouvelle fonction pour récupérer l'historique de tous les clients
export const getAllHistoriqueAchats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupérer toutes les commandes avec les détails clients
        const commandes = await prisma.commande.findMany({
            include: {
                panier: {
                    include: {
                        lignePanier: {
                            include: {
                                produit: true
                            }
                        }
                    }
                },
                livraison: true,
                client: {
                    include: {
                        utilisateur: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        if (!commandes || commandes.length === 0) {
            res.status(404).json({ message: 'Aucun historique d\'achat trouvé' });
            return;
        }

        // Formater les données pour la réponse
        const historique = commandes.map(commande => {
            const produits = commande.panier.lignePanier.map(ligne => ({
                id: ligne.produit.id,
                designation: ligne.produit.designation,
                quantite: ligne.qteCmd,
                prixUnitaire: ligne.prix,
                total: ligne.sousTotal,
                points: ligne.produit.nbrPoint * ligne.qteCmd
            }));

            return {
                id: commande.id,
                date: commande.panier.date,
                client: {
                    id: commande.client.id,
                    nom: commande.client.utilisateur.nom,
                    prenom: commande.client.utilisateur.prenom,
                    email: commande.client.utilisateur.email
                },
                produits,
                remise: commande.pourcentageRemise || 0,
                montantLivraison: commande.montantLivraison,
                montantTotal: commande.montantAPayer,
                pointsUtilises: commande.pointsUtilises,
                pointsGagnes: commande.pointsGagnes,
                statutLivraison: commande.livraison[0]?.statutLivraison || 'En attente'
            };
        });

        res.status(200).json(historique);
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique global' });
    }
};
export const getClientDetails = async (req: Request, res: Response): Promise<void> => {
    const { clientId } = req.params;

    try {
        // Récupérer toutes les informations du client
        const client = await prisma.client.findUnique({
            where: { id: parseInt(clientId) },
            include: {
                utilisateur: true,
                panier: {
                    include: {
                        lignePanier: {
                            include: {
                                produit: true
                            }
                        }
                    },
                    orderBy: {
                        date: 'desc'
                    },
                    take: 1
                },
                commande: {
                    include: {
                        panier: {
                            include: {
                                lignePanier: {
                                    include: {
                                        produit: true
                                    }
                                }
                            }
                        },
                        livraison: true
                    },
                    orderBy: {
                        id: 'desc'
                    },
                    take: 5
                }
            }
        });

        if (!client) {
            res.status(404).json({ error: 'Client non trouvé' });
            return;
        }

        // Formater la réponse
        const response = {
            informationsPersonnelles: {
                nom: client.utilisateur.nom,
                prenom: client.utilisateur.prenom,
                email: client.utilisateur.email,
                telephone: client.utilisateur.telephone,
                ville: client.utilisateur.ville,
                codePostal: client.utilisateur.codePostal,
                gouvernorat: client.utilisateur.gouvernorat,
                dateInscription: client.utilisateur.inscritLe
            },
            points: {
                solde: client.soldePoints,
                historique: client.historiquePoints ? JSON.parse(client.historiquePoints.toString()) : []
            },
            panierActuel: client.panier.length > 0 ? {
                id: client.panier[0].id,
                total: client.panier[0].total,
                nombreArticles: client.panier[0].lignePanier.reduce((sum, ligne) => sum + ligne.qteCmd, 0),
                articles: client.panier[0].lignePanier.map(ligne => ({
                    produitId: ligne.produit.id,
                    designation: ligne.produit.designation,
                    quantite: ligne.qteCmd,
                    prixUnitaire: ligne.prix,
                    image: ligne.produit.images[0] || null
                }))
            } : null,
            dernieresCommandes: client.commande.map(commande => ({
                id: commande.id,
                date: commande.panier.date,
                total: commande.total,
                pointsUtilises: commande.pointsUtilises,
                pointsGagnes: commande.pointsGagnes,
                statut: commande.livraison && commande.livraison.length > 0 
                    ? commande.livraison[0].statutLivraison 
                    : 'En attente'
            }))
        };

        res.status(200).json(response);
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des détails du client' });
    }
};
export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
    // Le middleware a déjà vérifié le token et ajouté les infos utilisateur à req.user
    const userId = (req as any).user.id;

    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: userId },
            include: { 
                client: {
                    include: {
                        panier: {
                            include: {
                                lignePanier: {
                                    include: {
                                        produit: true
                                    }
                                }
                            },
                            orderBy: { date: 'desc' },
                            take: 1
                        },
                        commande: {
                            include: {
                                panier: true,
                                livraison: true
                            },
                            orderBy: { id: 'desc' },
                            take: 5
                        }
                    }
                } 
            }
        });

        if (!utilisateur || !utilisateur.client) {
            res.status(404).json({ error: 'Client non trouvé' });
            return;
        }

        // Formater la réponse
        const response = {
            informationsPersonnelles: {
                id: utilisateur.id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                telephone: utilisateur.telephone,
                ville: utilisateur.ville,
                codePostal: utilisateur.codePostal,
                gouvernorat: utilisateur.gouvernorat,
                dateInscription: utilisateur.inscritLe
            },
            points: {
                solde: utilisateur.client.soldePoints,
                historique: utilisateur.client.historiquePoints 
                    ? JSON.parse(utilisateur.client.historiquePoints.toString()) 
                    : []
            },
            panierActuel: utilisateur.client.panier.length > 0 ? {
                id: utilisateur.client.panier[0].id,
                total: utilisateur.client.panier[0].total,
                nombreArticles: utilisateur.client.panier[0].lignePanier.reduce((sum, ligne) => sum + ligne.qteCmd, 0),
                articles: utilisateur.client.panier[0].lignePanier.map(ligne => ({
                    produitId: ligne.produit.id,
                    designation: ligne.produit.designation,
                    quantite: ligne.qteCmd,
                    prixUnitaire: ligne.prix,
                    image: ligne.produit.images[0] || null
                }))
            } : null,
            dernieresCommandes: utilisateur.client.commande.map(commande => ({
                id: commande.id,
                date: commande.panier.date,
                total: commande.total,
                pointsUtilises: commande.pointsUtilises,
                pointsGagnes: commande.pointsGagnes,
                statut: commande.livraison && commande.livraison.length > 0 
                    ? commande.livraison[0].statutLivraison 
                    : 'En attente'
            }))
        };

        res.status(200).json(response);
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
    }
};