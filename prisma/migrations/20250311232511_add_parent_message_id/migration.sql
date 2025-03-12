-- AlterTable
ALTER TABLE "Messagerie" ADD COLUMN     "parent_message_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Messagerie" ADD CONSTRAINT "Messagerie_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "Messagerie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
