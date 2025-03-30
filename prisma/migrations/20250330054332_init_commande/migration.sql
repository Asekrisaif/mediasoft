/*
  Warnings:

  - Added the required column `pointsGagnes` to the `Commande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsUtilises` to the `Commande` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commande" ADD COLUMN     "pointsGagnes" INTEGER NOT NULL,
ADD COLUMN     "pointsUtilises" INTEGER NOT NULL;
