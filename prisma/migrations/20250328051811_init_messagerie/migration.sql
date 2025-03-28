-- AlterTable
ALTER TABLE "Messagerie" ADD COLUMN     "lu" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Messagerie_utilisateur_id_idx" ON "Messagerie"("utilisateur_id");

-- CreateIndex
CREATE INDEX "Messagerie_parent_message_id_idx" ON "Messagerie"("parent_message_id");
