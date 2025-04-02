import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

export const generateInvoicePDF = async (commande: any, client: any, panier: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        generateHeader(doc);
        generateCustomerInformation(doc, client, commande);
        generateInvoiceTable(doc, panier, commande);
        generatePaymentInformation(doc, commande);
        generateFooter(doc);

        doc.end();
    });
};

function generateHeader(doc: PDFKit.PDFDocument) {
    doc.fillColor('#444444')
       .fontSize(20)
       .text('MediaSoft', 50, 50)
       .fontSize(10)
       .text('123 Rue de Commerce', 200, 50, { align: 'right' })
       .text('Tunis, 1001', 200, 65, { align: 'right' })
       .moveDown();
}

function generateCustomerInformation(doc: PDFKit.PDFDocument, client: any, commande: any) {
    doc.fillColor('#444444')
       .fontSize(20)
       .text('Facture', 50, 120);

    generateHr(doc, 150);

    const customerInformationTop = 160;

    doc.fontSize(10)
       .text('N° Commande:', 50, customerInformationTop)
       .text(commande.id.toString(), 150, customerInformationTop)
       .text('Date:', 50, customerInformationTop + 15)
       .text(new Date().toLocaleDateString(), 150, customerInformationTop + 15)
       .text('Montant:', 50, customerInformationTop + 30)
       .text(`${commande.montantAPayer.toFixed(2)} €`, 150, customerInformationTop + 30)
       .text('Client:', 300, customerInformationTop)
       .text(`${client.utilisateur.prenom} ${client.utilisateur.nom}`, 400, customerInformationTop)
       .text('Email:', 300, customerInformationTop + 15)
       .text(client.utilisateur.email, 400, customerInformationTop + 15)
       .text('Téléphone:', 300, customerInformationTop + 30)
       .text(client.utilisateur.telephone, 400, customerInformationTop + 30)
       .moveDown();

    generateHr(doc, 200);
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, panier: any, commande: any) {
    let i;
    const invoiceTableTop = 220;

    doc.font('Helvetica-Bold');
    generateTableRow(
        doc,
        invoiceTableTop,
        'Produit',
        'Quantité',
        'Prix Unitaire',
        'Total'
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < panier.lignePanier.length; i++) {
        const item = panier.lignePanier[i];
        const position = invoiceTableTop + (i + 1) * 30;
        
        generateTableRow(
            doc,
            position,
            item.produit.designation,
            item.qteCmd.toString(),
            `${item.prix.toFixed(2)} €`,
            `${item.sousTotal.toFixed(2)} €`
        );

        generateHr(doc, position + 20);
    }

    const totalsTop = invoiceTableTop + (i + 1) * 30;
    
    generateTableRow(
        doc,
        totalsTop,
        '',
        '',
        'Sous-total',
        `${commande.total.toFixed(2)} €`
    );

    generateTableRow(
        doc,
        totalsTop + 20,
        '',
        '',
        'Remise',
        `-${commande.remise.toFixed(2)} €`
    );

    generateTableRow(
        doc,
        totalsTop + 40,
        '',
        '',
        'Frais de livraison',
        `${commande.montantLivraison.toFixed(2)} €`
    );

    generateTableRow(
        doc,
        totalsTop + 60,
        '',
        '',
        'Total à payer',
        `${commande.montantAPayer.toFixed(2)} €`,
        true
    );
}

function generatePaymentInformation(doc: PDFKit.PDFDocument, commande: any) {
    doc.font('Helvetica-Bold')
       .fontSize(12)
       .text('Méthode de paiement:', 50, 500);

    if (commande.paiement) {
        const paymentMethod = commande.paiement.methode === 'carte' ? 'Carte bancaire' : 'Espèces';
        doc.font('Helvetica')
           .text(paymentMethod, 50, 515);

        if (commande.paiement.methode === 'carte' && commande.paiement.detailsCarte) {
            const card = commande.paiement.detailsCarte;
            doc.text(`Derniers chiffres: **** **** **** ${card.last4 || '****'}`, 50, 530)
               .text(`Type: ${card.brand || 'Inconnu'}`, 50, 545)
               .text(`Expiration: ${card.exp_month || '**'}/${card.exp_year || '****'}`, 50, 560);
        }
        
        doc.text(`Statut: ${commande.paiement.statut}`, 50, 575);
    } else {
        doc.font('Helvetica')
           .text('Espèces (à payer à la livraison)', 50, 515)
           .text('Statut: En attente de paiement', 50, 530);
    }
}

function generateFooter(doc: PDFKit.PDFDocument) {
    doc.fontSize(10)
       .text('Merci pour votre achat.', 50, 650, { align: 'center' });
}

function generateTableRow(
    doc: PDFKit.PDFDocument,
    y: number,
    item: string,
    quantity: string,
    unitPrice: string,
    lineTotal: string,
    bold = false
) {
    if (bold) {
        doc.font('Helvetica-Bold');
    }
    
    doc.fontSize(10)
       .text(item, 50, y)
       .text(quantity, 280, y, { width: 90, align: 'right' })
       .text(unitPrice, 370, y, { width: 90, align: 'right' })
       .text(lineTotal, 0, y, { align: 'right' });
    
    if (bold) {
        doc.font('Helvetica');
    }
}

function generateHr(doc: PDFKit.PDFDocument, y: number) {
    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, y)
       .lineTo(550, y)
       .stroke();
}