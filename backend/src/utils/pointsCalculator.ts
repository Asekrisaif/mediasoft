export const calculatePoints = (panier: any) => {
    return panier.lignePanier.reduce((total: number, ligne: any) => {
        return total + (ligne.produit.nbrPoint * ligne.qteCmd);
    }, 0);
};

export const calculateDiscount = (pointsDisponibles: number, totalPanier: number) => {
    // Calculer le nombre de lots de 100 points (max 5 lots)
    const lotsDe100Points = Math.min(Math.floor(pointsDisponibles / 100), 5);
    
    // Calculer le pourcentage de réduction (10% par lot)
    const pourcentageRemise = lotsDe100Points * 10;
    
    // Calculer la remise en euros
    return {
        pourcentage: pourcentageRemise,
        montant: totalPanier * (pourcentageRemise / 100),
        pointsUtilises: lotsDe100Points * 100
    };
};