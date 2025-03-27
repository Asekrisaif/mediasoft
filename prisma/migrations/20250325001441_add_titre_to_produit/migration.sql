/*
  Warnings:

  - You are about to drop the column `designation` on the `Produit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Produit" DROP COLUMN "designation",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "titre" TEXT NOT NULL DEFAULT 'Titre par défaut';
