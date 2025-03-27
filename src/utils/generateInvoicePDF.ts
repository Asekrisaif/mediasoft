import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Response } from 'express';

export const generateInvoicePDF = async (commande: any, client: any, panier: any, res: Response): Promise<void> => {
    const invoiceDir = path.join(__dirname, 'invoices');
    const filePath = path.join(invoiceDir, `invoice_${commande.id}.pdf`);

    // Créer le dossier invoices s'il n'existe pas
    if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // En-tête de la facture
    doc.fontSize(20).text('Facture', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Facture pour la commande #${commande.id}`, { align: 'left' });
    doc.moveDown();

    // Informations du client
    doc.fontSize(12).text(`Client: ${client.utilisateur.nom} ${client.utilisateur.prenom}`);
    doc.text(`Email: ${client.utilisateur.email}`);
    doc.text(`Téléphone: ${client.utilisateur.telephone}`);
    doc.moveDown();

    // Date de la commande
    doc.text(`Date de la commande: ${commande.dateLivraison.toLocaleDateString()}`);
    doc.moveDown();

    // Détails de la commande sous forme de tableau
    doc.fontSize(12).text('Détails de la commande:', { underline: true });
    doc.moveDown();

    // En-tête du tableau
    const table = {
        headers: ['Produit', 'Quantité', 'Prix Unitaire', 'Prix Total'],
        rows: [] as string[][],
    };

    // Ajouter les produits du panier dans le tableau
    panier.lignePanier.forEach((ligne: any) => {
        table.rows.push([
            ligne.produit.designation,
            ligne.qteCmd.toString(),
            `${ligne.prix}€`,
            `${ligne.sousTotal}€`,
        ]);
    });

    // Dessiner le tableau
    const startY = doc.y;
    const cellPadding = 10;
    const columnWidth = (doc.page.width - 100) / table.headers.length;

    // Dessiner les en-têtes du tableau
    doc.font('Helvetica-Bold');
    table.headers.forEach((header, i) => {
        doc.text(header, 50 + i * columnWidth, startY, {
            width: columnWidth,
            align: 'left',
        });
    });
    doc.font('Helvetica'); // Réinitialiser la police

    // Dessiner les lignes du tableau
    table.rows.forEach((row, rowIndex) => {
        const y = startY + (rowIndex + 1) * 20;
        row.forEach((cell, cellIndex) => {
            doc.text(cell, 50 + cellIndex * columnWidth, y, {
                width: columnWidth,
                align: 'left',
            });
        });
    });

    // Ligne de séparation
    doc.moveTo(50, doc.y + 20).lineTo(doc.page.width - 50, doc.y + 20).stroke();
    doc.moveDown();

    // Montants totaux
    doc.fontSize(12).text(`Total: ${commande.total}€`);
    doc.text(`Remise: ${commande.remise}€`);
    doc.text(`Montant à payer: ${commande.montantAPayer}€`);
    doc.moveDown();

    // Informations supplémentaires (livreur, etc.)
    doc.text(`Montant à payer par le livreur: ${commande.montantLivraison}€`);
    doc.moveDown();

    // Finaliser le PDF
    doc.end();

    // Envoyer le PDF en réponse
    writeStream.on('finish', () => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice_${commande.id}.pdf"`);
        fs.createReadStream(filePath).pipe(res);
    });

    writeStream.on('error', (err) => {
        console.error('Erreur lors de la génération du PDF:', err);
        res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
    });
};