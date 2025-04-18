import { Request, Response, NextFunction } from 'express';

export const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
    // Pour les routes qui ne nécessitent pas d'authentification
    const openRoutes = [
        { path: '/api/admin/login', method: 'POST' }
        
    ];

    const shouldSkipAuth = openRoutes.some(route =>
        req.path.startsWith(route.path) && req.method === route.method
    );

    if (shouldSkipAuth) {
        next();
        return;
    }

    // Vérifier la session admin (simplifié sans JWT)
    const adminData = req.headers['admin-data'];
    
    if (!adminData) {
        res.status(401).json({ error: 'Non autorisé - Admin non connecté' });
        return;
    }

    try {
        // Ici vous pourriez vérifier en base de données si l'admin existe toujours
        // Pour cette version simplifiée, nous faisons confiance aux données
        (req as any).admin = JSON.parse(adminData as string);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Session admin invalide' });
    }
};