-- CreateTable
CREATE TABLE "Pessoas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "Pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clientes" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoas_email_key" ON "Pessoas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoas_cpf_key" ON "Pessoas"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_pessoaId_key" ON "Clientes"("pessoaId");

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
