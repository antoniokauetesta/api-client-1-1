import express from "express";
import prisma from "./lib/prisma.ts";

const app = express();

app.use(express.json());

app.get("/pessoas", async (req, res) => {
  try {
    const pessoas = await prisma.pessoa.findMany({
      include: {
        email: true,
      },
    });

    res.json(pessoas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao buscar pessoas",
    });
  }
});

app.get("/pessoas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pessoa = await prisma.pessoa.findUnique({
      where: {
        id,
      },
      include: {
        email: true,
      },
    });

    if (!pessoa) {
      return res.status(404).json({
        erro: "Pessoa não encontrada",
      });
    }

    res.json(pessoa);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao buscar pessoa",
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});