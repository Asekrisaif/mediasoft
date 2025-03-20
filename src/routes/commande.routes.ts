import { Router } from 'express';
import { validatePanierAndCreateCommande } from '../controllers/commande.controller'; // Importez les contrôleurs nécessaires

const router = Router();


// Route pour valider le panier et créer une commande
router.post('/validate-panier', validatePanierAndCreateCommande);
export default router; // Exportez le routeur