import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const generateInvoicePDF = async (commande: any, client: any, panier: any): Promise<Buffer> => {
    const invoiceDir = path.join(__dirname, '..', 'invoices');
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const filePath = path.join(invoiceDir, `facture_${commande.id}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];
        
        // Écrire dans le fichier ET en mémoire
        doc.pipe(writeStream);
        doc.on('data', (chunk) => buffers.push(chunk));
        
        doc.on('end', () => {
            writeStream.end();
            resolve(Buffer.concat(buffers));
        });
        
        doc.on('error', (err) => {
            writeStream.destroy();
            reject(err);
        });
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

        // Informations supplémentaires
        doc.text(`Montant à payer par le livreur: ${commande.montantLivraison}€`);
        doc.moveDown();

        // Finaliser le PDF
        doc.end();
    });
};