/*
  Warnings:

  - You are about to drop the `MessageInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageInfo" DROP CONSTRAINT "MessageInfo_utilisateur_id_fkey";

-- DropTable
DROP TABLE "MessageInfo";
