import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

// Interface et cache pour les produits tendance
interface TrendingProduct {
    id: number;
    designation: string;
    description: string | null;
    images: string[];
    prix: number;
    nbrPoint: number;
    clientsUniques: number;
}

let trendingProductsCache: TrendingProduct[] | null = null;
let lastCacheUpdate: number | null = null;

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const { designation, description, images, qteStock, prix, nbrPoint, seuilMin } = req.body;

    if (!designation || !qteStock || !prix || !nbrPoint || !seuilMin) {
        res.status(400).json({ error: 'Les champs designation, qteStock, prix, nbrPoint et seuilMin sont requis.' });
        return;
    }

    try {
        const product = await prisma.produit.create({
            data: {
                designation,
                description: description || null,
                images: images || [],
                qteStock,
                prix,
                nbrPoint,
                seuilMin,
            },
        });

        res.status(201).json({ message: 'Produit créé avec succès', data: product });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la création du produit', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la création du produit' });
        }
    }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.produit.findMany({
            where: { deleted: false }
        });

        res.status(200).json({ products });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des produits', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des produits' });
        }
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID de produit invalide ou manquant.' });
        return;
    }

    try {
        const product = await prisma.produit.findUnique({
            where: { id: Number(id) },
        });

        if (!product) {
            res.status(404).json({ error: 'Produit non trouvé.' });
            return;
        }

        res.status(200).json({ product });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération du produit', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération du produit' });
        }
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { designation, description, images, qteStock, prix, nbrPoint, seuilMin } = req.body;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID de produit invalide ou manquant.' });
        return;
    }

    try {
        const product = await prisma.produit.update({
            where: { id: Number(id) },
            data: {
                designation,
                description,
                images,
                qteStock,
                prix,
                nbrPoint,
                seuilMin,
            },
        });

        res.status(200).json({ message: 'Produit mis à jour avec succès', data: product });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du produit', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la mise à jour du produit' });
        }
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID de produit invalide ou manquant.' });
        return;
    }

    try {
        // Soft delete au lieu de supprimer définitivement
        await prisma.produit.update({
            where: { id: Number(id) },
            data: { deleted: true }
        });

        res.status(200).json({ message: 'Produit marqué comme supprimé avec succès' });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la suppression du produit', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la suppression du produit' });
        }
    }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
    const { designation } = req.query;

    if (!designation) {
        res.status(400).json({ error: 'Le paramètre de recherche est requis.' });
        return;
    }

    try {
        const products = await prisma.produit.findMany({
            where: {
                designation: {
                    contains: designation as string,
                    mode: 'insensitive',
                },
                deleted: false
            },
        });

        res.status(200).json({ products });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la recherche des produits', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la recherche des produits' });
        }
    }
};
// Add these new functions to your controller
export const checkStock = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const product = await prisma.produit.findUnique({
            where: { id: Number(id) },
            select: { qteStock: true }
        });
        res.status(200).json({ stock: product?.qteStock });
    } catch (err) {
        res.status(500).json({ error: 'Error checking stock' });
    }
};

export const updateStock = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { qteStock } = req.body;
    try {
        const product = await prisma.produit.update({
            where: { id: Number(id) },
            data: { qteStock }
        });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error updating stock' });
    }
};

export const getLowStockProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.produit.findMany({
            where: {
                qteStock: { lt: 10 }, // Adjust threshold as needed
                deleted: false
            }
        });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error getting low stock products' });
    }
};

export const getProductDashboard = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const product = await prisma.produit.findUnique({
            where: { id: Number(id) },
            include: { lignePanier: true }
        });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error getting product dashboard' });
    }
};
export const getTrendingProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        // Version corrigée avec la requête SQL proprement formatée
        const trendingProducts = await prisma.$queryRaw<TrendingProduct[]>`
            SELECT 
                p.id,
                p.designation,
                p.description,
                p.images,
                p.prix,
                p."nbrPoint",
                COUNT(DISTINCT c.client_id) as "clientsUniques"
            FROM 
                "Produit" p
            LEFT JOIN 
                "LignePanier" lp ON p.id = lp.produit_id
            LEFT JOIN 
                "Panier" pan ON lp.panier_id = pan.id
            LEFT JOIN 
                "Commande" c ON pan.id = c.panier_id
            WHERE 
                p.deleted = false
            GROUP BY 
                p.id, p.designation, p.description, p.images, p.prix, p."nbrPoint"
            ORDER BY 
                "clientsUniques" DESC
            LIMIT 10
        `;

        res.status(200).json(trendingProducts.map(p => ({
            ...p,
            clientsUniques: Number(p.clientsUniques) || 0
        })));
    } catch (err) {
        console.error('Erreur:', err);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des produits tendance',
            details: err instanceof Error ? err.message : 'Erreur inconnue'
        });
    }
};