import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { createObjectCsvWriter } from 'csv-writer'; // Import pour CSV
import PDFDocument from 'pdfkit'; // Import pour PDF

const prisma = new PrismaClient();


export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const { designation, qteStock, prix, nbrPoint, seuilMin } = req.body;

    if (!designation || !qteStock || !prix || !nbrPoint || !seuilMin) {
        res.status(400).json({ error: 'Tous les champs sont requis.' });
        return;
    }

    try {
        const product = await prisma.produit.create({
            data: {
                designation,
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
        const products = await prisma.produit.findMany();

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
    const { designation, qteStock, prix, nbrPoint, seuilMin } = req.body;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID de produit invalide ou manquant.' });
        return;
    }

    try {
        const product = await prisma.produit.update({
            where: { id: Number(id) },
            data: {
                designation,
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
        await prisma.produit.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: 'Produit supprimé avec succès' });
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
                    mode: 'insensitive', // Recherche insensible à la casse
                },
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
export const checkStock = async (req: Request, res: Response): Promise<void> => {
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

        res.status(200).json({ stock: product.qteStock });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la vérification du stock', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la vérification du stock' });
        }
    }
};
export const getProductDashboard = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

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
export const updateStock = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { qteStock } = req.body;

    try {
        const product = await prisma.produit.update({
            where: { id: Number(id) },
            data: { qteStock },
        });

        res.status(200).json({ message: 'Stock mis à jour avec succès', data: product });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du stock', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la mise à jour du stock' });
        }
    }
};
export const getLowStockProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const produits = await prisma.produit.findMany({
            where: {
                qteStock: {
                    lte: await prisma.produit.findFirst().then((p) => p?.seuilMin), // Comparer avec le seuilMin
                },
            },
        });

        res.status(200).json({ produits });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Erreur SQL:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des produits à faible stock', details: err.message });
        } else {
            console.error('Erreur inconnue:', err);
            res.status(500).json({ error: 'Erreur inconnue lors de la récupération des produits à faible stock' });
        }
    }
};