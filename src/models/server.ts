import express, { Application } from "express";
import path from "path";
import userRoutes from '../routes/user.routes';
import routesDefault from '../routes/default.routes';
import routesProducto from '../routes/producto.routes';
import routesMessagerie from '../routes/messagerie.routes'; // Importez les routes de messagerie
import routesNotification from '../routes/notification.routes';
import routesProduit from '../routes/produit.routes'; // Corrected the missing '=' sign
import routesCommande from '../routes/commande.routes'; // Importez les routes produit
import routesPanier from '../routes/panier.routes'; // Importez les routes du panier
import clientRoutes from '../routes/client.routes'; // Importez les routes du client
import adminRoutes from '../routes/admin.routes'; // Importez les routes de l'admin
import authRoutes from '../routes/auth.routes'; // Optionnel
import cors from 'cors'; // Importez le module cors

class Server {
    private app: express.Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.middlewares();
        this.listen();
        this.routes();
    }

    // Méthode pour configurer les middlewares
    middlewares() {
        this.app.use(cors()); // Activez CORS
        this.app.use(express.json()); // Middleware pour parser les requêtes JSON
        this.app.use(express.urlencoded({ extended: true })); // Middleware pour parser les données de formulaire
        this.app.use(express.static(path.join(__dirname, '..', '..', 'public'))); // Servir les fichiers statiques
    }

    // Méthode pour démarrer le serveur
    listen() {
        this.app.listen(this.port, () => {
            console.log('Serveur en cours d\'exécution sur le port', this.port);
        });
    }

    // Méthode pour configurer les routes
    routes() {
        this.app.use('/', routesDefault); // Routes par défaut
        this.app.use('/api/productos', routesProducto); // Routes produit
        this.app.use('/api/messagerie', routesMessagerie); // Routes de messagerie
        this.app.use('/api/notifications', routesNotification); // Routes de notification
        this.app.use('/api/produit', routesProduit); // Routes produit
        this.app.use('/api/commande', routesCommande);
        this.app.use('/api/panier', routesPanier); // Utilisez les routes du panier
        this.app.use('/api', adminRoutes); // Utilisez les routes de l'admin
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api', clientRoutes); // Utilisez les routes du client
        this.app.use('/api/users', userRoutes);

        // Route pour servir la page de réinitialisation du mot de passe
        this.app.get('/reset-password', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'reset-password.html'));
        });

        // Route pour servir la page de demande de réinitialisation du mot de passe
        this.app.get('/forgot-password', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'forgot-password.html'));
        });

        // Route pour servir low-stock.html
        this.app.get('/low-stock', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'low-stock.html'));
        });
    }
}

export default Server;