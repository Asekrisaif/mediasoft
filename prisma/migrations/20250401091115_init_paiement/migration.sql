-- CreateTable
CREATE TABLE "Paiement" (
    "id" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "methode" TEXT NOT NULL,
    "detailsCarte" JSONB,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commande_id" INTEGER NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_commande_id_key" ON "Paiement"("commande_id");

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
