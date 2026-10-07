/*
  Warnings:

  - You are about to drop the `Clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pessoas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clientes" DROP CONSTRAINT "Clientes_pessoaId_fkey";

-- DropTable
DROP TABLE "Clientes";

-- DropTable
DROP TABLE "Pessoas";

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_email_key" ON "Pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_cpf_key" ON "Pessoa"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_pessoaId_key" ON "Cliente"("pessoaId");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
