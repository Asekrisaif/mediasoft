// Dans un nouveau fichier middleware/role.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const isClient = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (user && user.role === 'client') {
        return next();
    }
    
    res.status(403).json({ error: 'Accès refusé' });
};