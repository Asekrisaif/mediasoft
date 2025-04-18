import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const createAdmin = async (req: Request, res: Response): Promise<void> => {
    const { nom, prenom, email, telephone, ville, codePostal, gouvernorat, motDePasse } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(motDePasse, 10);
        const admin = await prisma.admin.create({
            data: {
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
                        role: "admin",
                        statut: "actif",
                        emailVerified: true 
                    }
                }
            },
            include: {
                utilisateur: true,
            },
        });

        res.status(201).json({ message: 'Admin créé avec succès', data: admin });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de la création de l\'admin', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const blockUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide ou manquant.' });
        return;
    }

    try {
        const updatedUser = await prisma.utilisateur.update({
            where: { id: Number(id) },
            data: { statut: 'bloqué' }
        });

        res.status(200).json({ message: 'Utilisateur bloqué avec succès', user: updatedUser });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors du blocage de l\'utilisateur', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const unblockUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'ID invalide ou manquant.' });
        return;
    }

    try {
        const updatedUser = await prisma.utilisateur.update({
            where: { id: Number(id) },
            data: { statut: 'actif' }
        });

        res.status(200).json({ message: 'Utilisateur débloqué avec succès', user: updatedUser });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors du déblocage de l\'utilisateur', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

export const exportUsers = async (req: Request, res: Response): Promise<void> => {
    const { format } = req.params;

    try {
        const clients = await prisma.utilisateur.findMany({
            where: { role: 'client' },
            include: { client: true }
        });

        if (format === 'csv') {
            await exportToCSV(clients, res);
        } else if (format === 'pdf') {
            await exportToPDF(clients, res);
        } else {
            res.status(400).json({ error: 'Format non supporté. Utilisez "csv" ou "pdf".' });
        }
    } catch (err) {
        console.error('Erreur lors de l\'exportation des utilisateurs:', err);
        res.status(500).json({ error: 'Erreur lors de l\'exportation des utilisateurs', details: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
};

const exportToCSV = async (clients: any[], res: Response): Promise<void> => {
    const filePath = path.join(__dirname, 'export.csv');
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'id', title: 'ID' },
            { id: 'nom', title: 'Nom' },
            { id: 'prenom', title: 'Prénom' },
            { id: 'email', title: 'Email' },
            { id: 'telephone', title: 'Téléphone' },
            { id: 'ville', title: 'Ville' },
            { id: 'codePostal', title: 'Code Postal' },
            { id: 'gouvernorat', title: 'Gouvernorat' },
        ],
    });

    const records = clients.map(user => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        ville: user.ville,
        codePostal: user.codePostal,
        gouvernorat: user.gouvernorat,
    }));

    try {
        await csvWriter.writeRecords(records);

        res.download(filePath, 'clients.csv', (err) => {
            if (err) {
                console.error('Erreur lors de l\'envoi du fichier CSV:', err);
                res.status(500).json({ error: 'Erreur lors de l\'envoi du fichier CSV' });
            }
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        console.error('Erreur lors de la génération du fichier CSV:', err);
        res.status(500).json({ error: 'Erreur lors de la génération du fichier CSV' });
    }
};

const exportToPDF = async (clients: any[], res: Response): Promise<void> => {
    const filePath = path.join(__dirname, 'export.pdf');
    const doc = new PDFDocument();

    doc.fontSize(14).text('Liste des Clients', { align: 'center' });
    clients.forEach((user, index) => {
        doc.fontSize(12).text(`${index + 1}. ${user.nom} ${user.prenom} - ${user.email}`);
        doc.fontSize(10).text(`Téléphone: ${user.telephone}, Ville: ${user.ville}`);
    });

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.end();

    writeStream.on('finish', () => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="clients.pdf"');

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);

        readStream.on('end', () => {
            fs.unlinkSync(filePath);
        });
    });

    writeStream.on('error', (err) => {
        console.error('Erreur lors de la génération du fichier PDF:', err);
        res.status(500).json({ error: 'Erreur lors de la génération du fichier PDF' });
    });
};
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
        res.status(400).json({ error: 'Tous les champs sont requis' });
        return;
    }

    try {
        // Vérifier d'abord si l'email existe
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { email },
            select: { id: true, motDePasse: true, role: true }
        });

        if (!utilisateur) {
            res.status(401).json({ error: 'Compte incorrect' });
            return;
        }

        // Vérifier si c'est un admin
        if (utilisateur.role !== 'admin') {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

        if (!motDePasseValide) {
            res.status(401).json({ error: 'Champ(s) invalide(s)' });
            return;
        }

        // Si tout est correct
        const admin = await prisma.admin.findUnique({
            where: { id: utilisateur.id },
            include: { utilisateur: true }
        });

        if (!admin) {
            res.status(404).json({ error: 'Compte admin non trouvé' });
            return;
        }

        res.status(200).json({ 
            message: 'Connexion réussie',
            admin: {
                id: admin.id,
                email: admin.utilisateur.email,
                nom: admin.utilisateur.nom,
                prenom: admin.utilisateur.prenom
            }
        });

    } catch (err) {
        console.error('Erreur lors de la connexion admin:', err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};