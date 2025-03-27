import { Router } from 'express';
import { Request, Response } from 'express';
import path from 'path';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    checkStock,
    getProductDashboard,
    updateStock,getLowStockProducts
} from '../controllers/produit.controller'; // Importez les nouvelles fonctions

const router = Router();
// Route pour servir la page HTML des produits à faible stock
router.get('/produits-faibles-page', (req: Request, res: Response) => {
    // Chemin absolu vers le fichier low-stock.html dans le dossier public
    const filePath = path.join(__dirname, '..', '..', 'public', 'low-stock.html');
    res.sendFile(filePath);
});

router.get('/search', searchProducts); // Rechercher des produits
// Routes pour la gestion des produits
router.post('/', createProduct); // Créer un produit
router.get('/', getAllProducts); // Récupérer tous les produits
router.get('/:id', getProductById); // Récupérer un produit par ID
router.put('/:id', updateProduct); // Mettre à jour un produit
router.delete('/:id', deleteProduct); // Supprimer un produit


// Routes pour la gestion des stocks
router.get('/:id/stock', checkStock); // Vérifier le stock d'un produit
// Route pour afficher le tableau de bord du produit
router.get('/admin/produit/:id', getProductDashboard);

// Route pour mettre à jour le stock
router.put('/admin/produit/:id/stock', updateStock);
router.get('/admin/produits-faibles', getLowStockProducts);


export default router;