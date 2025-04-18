import nodemailer from 'nodemailer';
import juice from 'juice';
import fs from 'fs';
import path from 'path';
import { PrismaClient, Produit } from '@prisma/client';

// Initialiser prisma ici pour le rendre disponible dans tout le fichier
const prisma = new PrismaClient();

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const currentYear = new Date().getFullYear();

        // Read the CSS file
        const cssPath = path.join(__dirname, 'emailStyles.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');

        const htmlContent = `
               <!DOCTYPE html>
               <html lang="fr">
               <head>
                   <meta charset="UTF-8">
                   <meta name="viewport" content="width=device-width, initial-scale=1.0">
                   <title>Vérification de votre email</title>
                   <style>
                       ${cssContent}
                   </style>
               </head>
               <body>
                   <div class="wrapper">
                       <div class="container">
                           <div class="header">
                               <div class="header-overlay"></div>
                               <div class="header-content">
                                   <div class="logo">TechVerse</div>
                                   <p class="header-tagline">Votre aventure technologique commence ici</p>
                               </div>
                           </div>
                           <div class="content">
                               <div class="welcome">Bienvenue dans notre univers tech !</div>
                               <div class="message">
                                   Nous sommes ravis de vous accueillir sur TechVerse. Pour activer votre compte et commencer votre voyage avec nous, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous.
                               </div>
                               
                               <div class="button-container">
                                   <a href="${verificationLink}" class="button">Vérifier mon email</a>
                               </div>
                               
                               <div class="message">
                                   Si le bouton ne fonctionne pas, vous pouvez également copier et coller ce lien dans votre navigateur :
                               </div>
                               
                               <div class="link-container">
                                   <div class="link">${verificationLink}</div>
                               </div>
                               
                               <div class="expiry-notice">
                                   <span class="expiry-icon">⏱️</span>
                                   <span class="expiry-text">Ce lien expirera dans 1 heure. Veuillez vérifier votre email rapidement.</span>
                               </div>
                               
                               <div class="note">
                                   Si vous n'avez pas créé de compte sur TechVerse, vous pouvez ignorer cet email en toute sécurité.
                               </div>
                           </div>
                           
                           <div class="footer">
                               <div class="social-links">
                                   <a href="#" class="social-link">𝕏</a>
                                   <a href="#" class="social-link">f</a>
                                   <a href="#" class="social-link">in</a>
                               </div>
                               <div>© ${currentYear} TechVerse. Tous droits réservés.</div>
                               <div class="footer-links">
                                   <a href="#" class="footer-link">Confidentialité</a>
                                   <a href="#" class="footer-link">Conditions d'utilisation</a>
                                   <a href="#" class="footer-link">Nous contacter</a>
                               </div>
                           </div>
                       </div>
                   </div>
               </body>
               </html>
           `;

        // Inline the CSS
        const inlinedHtml = juice(htmlContent);

        const mailOptions = {
            from: `"TechVerse" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Vérification de votre email - TechVerse',
            html: inlinedHtml
        };

        await transporter.sendMail(mailOptions);
        console.log('Email de vérification envoyé à:', email);
    } catch (err) {
        console.error('Erreur lors de l\'envoi de l\'email de vérification:', err);
        throw err;
    }
};


export const notifyAdminLowStock = async (produit: Produit): Promise<void> => {
    try {
        // Vérifier à nouveau l'état actuel du stock
        const currentProduct = await prisma.produit.findUnique({
            where: { id: produit.id }
        });

        if (!currentProduct || currentProduct.qteStock > currentProduct.seuilMin) {
            console.log(`Le produit ${produit.id} n'est plus en stock faible, notification annulée`);
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Récupérer tous les administrateurs
        const admins = await prisma.admin.findMany({
            include: { utilisateur: true }
        });

        if (admins.length === 0) {
            console.warn('Aucun administrateur trouvé pour envoyer la notification');
            return;
        }

        // Read the CSS file
        const cssPath = path.join(__dirname, 'emailStyles.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        const currentYear = new Date().getFullYear();

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Alerte Stock - ${produit.designation}</title>
                <style>
                    ${cssContent}
                    .alert-header {
                        background: linear-gradient(125deg, #dc2626 0%, #ef4444 100%);
                    }
                    .product-image {
                        width: 80px;
                        height: 80px;
                        object-fit: cover;
                        border-radius: 8px;
                        margin-right: 15px;
                    }
                    .product-detail {
                        display: flex;
                        align-items: center;
                        background-color: var(--bg-light);
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .product-info {
                        flex: 1;
                    }
                    .stock-indicator {
                        display: inline-block;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 600;
                        background-color: #fee2e2;
                        color: #dc2626;
                    }
                    .stock-detail {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 20px;
                    }
                    .stock-box {
                        flex: 1;
                        padding: 15px;
                        text-align: center;
                        border-radius: 8px;
                        margin: 0 5px;
                    }
                    .stock-current {
                        background-color: #fee2e2;
                        border: 1px solid #fecaca;
                    }
                    .stock-threshold {
                        background-color: #fef3c7;
                        border: 1px solid #fde68a;
                    }
                    .stock-diff {
                        background-color: #dbeafe;
                        border: 1px solid #bfdbfe;
                    }
                    .stock-value {
                        font-size: 24px;
                        font-weight: 700;
                        margin: 5px 0;
                    }
                    .stock-label {
                        font-size: 13px;
                        color: var(--text-secondary);
                    }
                    .action-button {
                        display: inline-block;
                        padding: 14px 32px;
                        background-color: #dc2626;
                        color: white;
                        text-decoration: none;
                        text-align: center;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
                    }
                    .action-button:hover {
                        background-color: #b91c1c;
                        box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3);
                        transform: translateY(-1px);
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="container">
                        <div class="header alert-header">
                            <div class="header-overlay"></div>
                            <div class="header-content">
                                <div class="logo">TechVerse</div>
                                <p class="header-tagline">Système d'Alerte de Stock</p>
                            </div>
                        </div>
                        <div class="content">
                            <div class="welcome">⚠️ Alerte de Stock Faible</div>
                            <div class="message">
                                Le produit suivant a atteint son seuil minimum de stock et nécessite votre attention immédiate.
                            </div>
                            
                            <div class="product-detail">
                                <div class="product-info">
                                    <h3 style="margin-top: 0; margin-bottom: 10px;">${produit.designation}</h3>
                                    <p style="margin: 0; color: var(--text-secondary);">ID: ${produit.id}</p>
                                    <div class="stock-indicator">Stock faible</div>
                                </div>
                            </div>
                            
                            <div class="stock-detail">
                                <div class="stock-box stock-current">
                                    <div class="stock-label">Stock actuel</div>
                                    <div class="stock-value">${currentProduct.qteStock}</div>
                                    <div class="stock-label">unités</div>
                                </div>
                                <div class="stock-box stock-threshold">
                                    <div class="stock-label">Seuil minimal</div>
                                    <div class="stock-value">${produit.seuilMin}</div>
                                    <div class="stock-label">unités</div>
                                </div>
                                <div class="stock-box stock-diff">
                                    <div class="stock-label">Déficit</div>
                                    <div class="stock-value">${Math.max(0, produit.seuilMin - currentProduct.qteStock)}</div>
                                    <div class="stock-label">unités</div>
                                </div>
                            </div>
                            
                            <div class="message" style="margin-top: 25px;">
                                <strong>Action requise :</strong> Veuillez procéder au réapprovisionnement dès que possible pour éviter les ruptures de stock.
                            </div>
                            
                            <div class="button-container">
                                <a href="${process.env.ADMIN_URL}/produits/${produit.id}" class="action-button">Gérer ce produit</a>
                            </div>
                            
                            <div class="note">
                                Ce message est généré automatiquement par le système d'alerte de stock. Ne pas répondre à cet email.
                            </div>
                        </div>
                        
                        <div class="footer">
                            <div class="social-links">
                                <a href="#" class="social-link">𝕏</a>
                                <a href="#" class="social-link">f</a>
                                <a href="#" class="social-link">in</a>
                            </div>
                            <div>© ${currentYear} TechVerse. Tous droits réservés.</div>
                            <div class="footer-links">
                                <a href="#" class="footer-link">Confidentialité</a>
                                <a href="#" class="footer-link">Conditions d'utilisation</a>
                                <a href="#" class="footer-link">Nous contacter</a>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Inline the CSS
        const inlinedHtml = juice(htmlContent);

        const mailOptions = {
            from: `"Alerte Stock TechVerse" <${process.env.EMAIL_USER}>`,
            to: admins.map(admin => admin.utilisateur.email).join(','),
            subject: `[ACTION REQUISE] Stock faible - ${produit.designation}`,
            html: inlinedHtml
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Notification de stock faible envoyée à ${admins.length} administrateur(s)`, info.messageId);

    } catch (err) {
        console.error('Erreur critique lors de l\'envoi de la notification de stock faible:', err);
        throw err;
    } finally {
        await prisma.$disconnect();
    }
};