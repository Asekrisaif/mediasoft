/*
  Warnings:

  - A unique constraint covering the columns `[utilisateur_id,produit_id]` on the table `Avis` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Avis" ADD COLUMN     "produit_id" INTEGER,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Avis_utilisateur_id_produit_id_key" ON "Avis"("utilisateur_id", "produit_id");

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
