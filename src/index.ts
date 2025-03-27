import Server from "./models/server";
import dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

const server = new Server(); // Crée une instance du serveur