import { Router } from 'express';
import { 
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    checkStock,
    getProductDashboard,
    updateStock,
    getLowStockProducts,
    getTrendingProducts
} from '../controllers/produit.controller';
import path from 'path';
import { Request, Response } from 'express';

const router = Router();

// Route pour la page HTML des produits tendance
router.get('/produits-tendance', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/produits-tendance.html'));
});

// Les autres routes existantes
router.get('/produits/tendance', getTrendingProducts);
router.get('/search', searchProducts);
router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id/stock', checkStock);
router.get('/admin/produit/:id', getProductDashboard);
router.put('/admin/produit/:id/stock', updateStock);
router.get('/admin/produits-faibles', getLowStockProducts);


export default router;