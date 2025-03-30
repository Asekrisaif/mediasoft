import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validatePanierAndCreateCommande,downloadInvoice } from '../controllers/commande.controller';

const router = Router();
const prisma = new PrismaClient();

router.post('/', validatePanierAndCreateCommande);
router.get('/:id/facture', downloadInvoice);

// Nouvelle route pour l'historique des points
router.get('/:clientId/points', async (req, res) => {
    try {
        const historique = await prisma.client.findUnique({
            where: { id: parseInt(req.params.clientId) },
            select: { historiqueAchats: true }
        });
        res.json(historique);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        await prisma.$disconnect();
    }
});

export default router;