import express from 'express';
import {
    createAvis,
    getAllAvis,
    getAvisById,
    updateAvis,
    deleteAvis,
    getAvisStats
} from '../controllers/avis.controller';

const router = express.Router();

router.post('/', createAvis);
router.get('/', getAllAvis);
router.get('/stats', getAvisStats);
router.get('/:id', getAvisById);
router.put('/:id', updateAvis);
router.delete('/:id', deleteAvis);

export default router;