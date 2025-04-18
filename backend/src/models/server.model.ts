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
import { authenticate } from '../middleware/auth.middleware';

class ExpressServer {
    public app: express.Application;
    public port: string;
    public httpServer: HttpServer;
    public io: SocketIOServer;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '5077';
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

    // In server.model.ts
    private middlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, '..', '..', 'public')));

        // Apply authentication to all routes except the public ones
        this.app.use((req, res, next) => {
            // Skip authentication for public routes
            const publicPaths = [
                '/api/auth',
                '/api/clients', // For client creation
                '/api/commande'
            ];

            if (publicPaths.some(path => req.path.startsWith(path) && req.method === 'POST')) {
                return next();
            }

            if (publicPaths.some(path => req.path.startsWith(path) && req.method === 'POST') ||
                req.path.match(/\/api\/commande\/\d+\/facture/) && req.method === 'GET') {
                return next();
            }

            // Apply authentication for all other routes
            authenticate(req, res, next);
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

        const adminRoutes = require('../routes/admin.routes').default;
        this.app.use('/api/admin', adminRoutes);
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