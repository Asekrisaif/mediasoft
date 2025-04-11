import express from "express";
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from "path";
import userRoutes from '../routes/user.routes';
import routesDefault from '../routes/default.routes';
import routesProducto from '../routes/producto.routes';
import { setupMessagerieRoutes } from '../routes/messagerie.routes';
import routesNotification from '../routes/notification.routes';
import routesProduit from '../routes/produit.routes';
import routesCommande from '../routes/commande.routes';
import routesPanier from '../routes/panier.routes';
import clientRoutes from '../routes/client.routes';
import adminRoutes from '../routes/admin.routes';
import authRoutes from '../routes/auth.routes';
import cors from 'cors';
import routesAvis from '../routes/avis.routes';
import livraisonRoutes from '../routes/livraison.routes';
import jwt from 'jsonwebtoken';

class ExpressServer {
    public app: express.Application;
    public port: string;
    public httpServer: HttpServer;
    public io: SocketIOServer;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.httpServer = createServer(this.app);
        this.io = new SocketIOServer(this.httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.middlewares();
        this.listen();
        this.routes();
        this.socketEvents();
    }

    private middlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, '..', '..', 'public')));
        
        // Middleware pour vérifier le token JWT
        this.app.use((req, res, next) => {
            // Exclure les routes qui n'ont pas besoin d'authentification
            if (req.path === '/api/auth/login' || 
                req.path === '/api/auth/reset-password' || 
                req.path === '/api/auth/verify-reset-token' ||
                req.path === '/api/clients' && req.method === 'POST'
            ) {
                return next();
            }
    
            const token = req.headers.authorization?.split(' ')[1];
            
            if (token) {
                jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt', (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ error: 'Token invalide' });
                    }
                    (req as any).user = decoded;
                    next();
                });
            } else {
                res.status(401).json({ error: 'Token manquant' });
            }
        });
    }

    private listen(): void {
        this.httpServer.listen(this.port, () => {
            console.log('Serveur en cours d\'exécution sur le port', this.port);
        });
    }

    private routes(): void {
        const messagerieRouter = setupMessagerieRoutes(this.io);

        this.app.use('/', routesDefault);
        this.app.use('/api/productos', routesProducto);
        this.app.use('/api/messagerie', messagerieRouter);
        this.app.use('/api/notifications', routesNotification);
        this.app.use('/api/produit', routesProduit);
        this.app.use('/api/commande', routesCommande);
        this.app.use('/api/panier', routesPanier);
        this.app.use('/api', adminRoutes);
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api', clientRoutes);
        this.app.use('/api/users', userRoutes);
        this.app.use('/api/avis', routesAvis);
        this.app.use('/api/livraisons', livraisonRoutes);
        this.app.use('/api/produit', routesProduit);

        this.app.get('/reset-password', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'reset-password.html'));
        });

        this.app.get('/forgot-password', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'forgot-password.html'));
        });

        this.app.get('/low-stock', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'low-stock.html'));
        });
        this.app.get('/historique-achats', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'historique-achats.html'));
        });
        this.app.get('/livraisons', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'livraisons.html'));
        });
        this.app.get('/payment-form', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'paiement-carte.html'));
        });
        this.app.get('/produits-tendance', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'produits-tendance.html'));
        });
        
    }

    private socketEvents(): void {
        this.io.on('connection', (socket) => {
            console.log('Nouvelle connexion Socket.io:', socket.id);

            socket.on('join_user_room', (userId: string) => {
                socket.join(`user_${userId}`);
                console.log(`Utilisateur ${userId} a rejoint sa room`);
            });

            socket.on('disconnect', () => {
                console.log('Utilisateur déconnecté:', socket.id);
            });
        });
    }
}

export default ExpressServer;