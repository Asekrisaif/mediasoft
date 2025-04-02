/*
  Warnings:

  - A unique constraint covering the columns `[commande_id]` on the table `Livraison` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Livraison_commande_id_key" ON "Livraison"("commande_id");
