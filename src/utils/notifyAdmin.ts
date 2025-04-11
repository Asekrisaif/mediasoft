import nodemailer from 'nodemailer';
import { PrismaClient, Produit } from '@prisma/client';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const notifyAdminLowStock = async (produit: Produit): Promise<void> => {
    const admins = await prisma.admin.findMany({
        include: { utilisateur: true },
    });

    for (const admin of admins) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: admin.utilisateur.email,
            subject: 'Alerte de stock faible',
            text: `Le stock du produit ${produit.designation} est faible. Le stock actuel est de ${produit.qteStock}, ce qui est inférieur ou égal au seuil minimum de ${produit.seuilMin}. Veuillez réapprovisionner le stock.`,
            html: `<p>Le stock du produit <strong>${produit.designation}</strong> est faible. Le stock actuel est de <strong>${produit.qteStock}</strong>, ce qui est inférieur ou égal au seuil minimum de <strong>${produit.seuilMin}</strong>. Veuillez réapprovisionner le stock.</p>
            <p><a href="http://localhost:3000/low-stock">Cliquez ici pour accéder à la liste des produits à faible stock</a></p>`,
        };

        await transporter.sendMail(mailOptions);
    }
};