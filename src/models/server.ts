import express, { Application } from "express";
import path from "path";
import routesUser from '../routes/user.routes';
import routesDefault from '../routes/default.routes';
import routesProducto from '../routes/producto.routes';

class Server {
    private app: express.Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.middlewares(); // Configuration des middlewares
        this.listen(); // Démarrage du serveur
        this.routes(); // Configuration des routes
    }

    // Méthode pour configurer les middlewares
    middlewares() {
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
        this.app.use('/api/users', routesUser); // Routes utilisateur
        this.app.use('/api/productos', routesProducto); // Routes produit

        // Route pour servir la page de réinitialisation du mot de passe
        this.app.get('/reset-password', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'reset-password.html'));
        });

        // Route pour servir la page de demande de réinitialisation du mot de passe
        this.app.get('/forgot-password', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'forgot-password.html'));
        });
    }
}

export default Server;