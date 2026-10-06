import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prisma from "./lib/prisma.ts";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.join(__dirname, "../dist");

app.use(express.json());
app.get("/", (req, res) => {
  res.redirect(302, "/clientes");
});
app.use(express.static(frontendPath));

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

app.post("/pessoas", async (req, res) => {
  const { nome, email, cpf } = req.body ?? {};

  if (
    typeof nome !== "string" ||
    typeof email !== "string" ||
    typeof cpf !== "string"
  ) {
    return res.status(400).json({
      erro: "Informe nome, e-mail e CPF como texto",
    });
  }

  const nomeNormalizado = nome.trim();
  const emailNormalizado = email.trim().toLowerCase();
  const cpfNormalizado = cpf.replace(/\D/g, "");

  if (!nomeNormalizado || !emailNormalizado || cpfNormalizado.length !== 11) {
    return res.status(400).json({
      erro: "Nome, e-mail e CPF válido são obrigatórios",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
    return res.status(400).json({
      erro: "Informe um e-mail válido",
    });
  }

  try {
    const pessoa = await prisma.pessoa.create({
      data: {
        nome: nomeNormalizado,
        cpf: cpfNormalizado,
        email: {
          create: {
            email: emailNormalizado,
          },
        },
      },
      include: {
        email: true,
      },
    });

    res.status(201).json(pessoa);
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        erro: "Este CPF ou e-mail já está cadastrado",
      });
    }

    console.error(error);
    res.status(500).json({
      erro: "Erro ao criar cadastro",
    });
  }
});

app.get("/pessoas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pessoa = await prisma.pessoa.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        email: true,
      },
    });

    res.json(pessoa);
  } catch (error) {
    console.error(error);

    res.status(404).json({
      erro: "Pessoa não encontrada ou erro na requisição",
    });
  }
});

app.get("/{*splat}", (req, res, next) => {
  if (req.method !== "GET" || !req.accepts("html")) {
    return next();
  }

  res.sendFile(path.join(frontendPath, "index.html"), (error) => {
    if (error) next(error);
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
