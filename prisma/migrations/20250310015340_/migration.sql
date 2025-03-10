-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "ville" TEXT NOT NULL DEFAULT '',
    "codePostal" TEXT NOT NULL DEFAULT '',
    "gouvernorat" TEXT NOT NULL DEFAULT '',
    "motDePasse" TEXT NOT NULL,
    "role" VARCHAR(10) NOT NULL,
    "inscritLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'actif',

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL,
    "soldePoints" INTEGER NOT NULL DEFAULT 0,
    "historiqueAchats" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "dateEnvoi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" VARCHAR(20) NOT NULL DEFAULT 'non lu',
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chatbot" (
    "id" SERIAL NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "Chatbot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Panier" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "livrerDomicile" BOOLEAN NOT NULL DEFAULT false,
    "client_id" INTEGER NOT NULL,

    CONSTRAINT "Panier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" SERIAL NOT NULL,
    "designation" TEXT NOT NULL,
    "qteStock" INTEGER NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "nbrPoint" INTEGER NOT NULL,
    "seuilMin" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LignePanier" (
    "id" SERIAL NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "qteCmd" INTEGER NOT NULL,
    "sousTotal" DOUBLE PRECISION NOT NULL,
    "panier_id" INTEGER NOT NULL,
    "produit_id" INTEGER NOT NULL,

    CONSTRAINT "LignePanier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "remise" DOUBLE PRECISION NOT NULL,
    "montantPoint" DOUBLE PRECISION NOT NULL,
    "montantLivraison" DOUBLE PRECISION NOT NULL,
    "montantAPayer" DOUBLE PRECISION NOT NULL,
    "dateLivraison" TIMESTAMP(3) NOT NULL,
    "client_id" INTEGER NOT NULL,
    "panier_id" INTEGER NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livraison" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "nomLivreur" TEXT NOT NULL,
    "statutLivraison" VARCHAR(50) NOT NULL,
    "detailPaiement" TEXT NOT NULL,
    "commande_id" INTEGER NOT NULL,

    CONSTRAINT "Livraison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageInfo" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT NOT NULL,
    "dateEnvoi" TIMESTAMP(3) NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "MessageInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messagerie" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT NOT NULL,
    "date_envoi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "Messagerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Chatbot_utilisateur_id_key" ON "Chatbot"("utilisateur_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_token_key" ON "ResetToken"("token");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_id_fkey" FOREIGN KEY ("id") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_id_fkey" FOREIGN KEY ("id") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chatbot" ADD CONSTRAINT "Chatbot_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panier" ADD CONSTRAINT "Panier_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LignePanier" ADD CONSTRAINT "LignePanier_panier_id_fkey" FOREIGN KEY ("panier_id") REFERENCES "Panier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LignePanier" ADD CONSTRAINT "LignePanier_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_panier_id_fkey" FOREIGN KEY ("panier_id") REFERENCES "Panier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "Commande"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageInfo" ADD CONSTRAINT "MessageInfo_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messagerie" ADD CONSTRAINT "Messagerie_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetToken" ADD CONSTRAINT "ResetToken_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
