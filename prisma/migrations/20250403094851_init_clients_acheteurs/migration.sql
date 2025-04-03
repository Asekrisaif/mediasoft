-- CreateTable
CREATE TABLE "_ClientsAcheteurs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClientsAcheteurs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClientsAcheteurs_B_index" ON "_ClientsAcheteurs"("B");

-- AddForeignKey
ALTER TABLE "_ClientsAcheteurs" ADD CONSTRAINT "_ClientsAcheteurs_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientsAcheteurs" ADD CONSTRAINT "_ClientsAcheteurs_B_fkey" FOREIGN KEY ("B") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
