import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "../src/lib/prisma.ts";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            mensagem: "Servidor funcionando!",
            banco: "PostgreSQL conectado!"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao conectar com o banco de dados"
        });
    }
});

app.get("/pessoas", async (req, res) => {
    try {
        const pessoas = await prisma.pessoa.findMany({
            include: {
                cliente: true
            }
        });

        res.json(pessoas);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar pessoas"
        });
    }
});

app.get("/pessoas/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const pessoa = await prisma.pessoa.findUnique({
            where: { id },
            include: {
                cliente: true
            }
        });

        if (!pessoa) {
            return res.status(404).json({
                erro: "Pessoa não encontrada"
            });
        }

        res.json(pessoa);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar pessoa"
        });
    }
});

app.post("/pessoas", async (req, res) => {
    try {
        const { nome, email, cpf } = req.body;

        const pessoa = await prisma.pessoa.create({
            data: {
                nome,
                email,
                cpf
            }
        });

        res.status(201).json(pessoa);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
});

app.put("/pessoas", async (req, res) => {
    try {
        const { id, nome, email, cpf } = req.body;

        const pessoa = await prisma.pessoa.update({
            where: { id },
            data: {
                nome,
                email,
                cpf
            }
        });

        res.json(pessoa);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao atualizar pessoa"
        });
    }
});

app.delete("/pessoas/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.pessoa.delete({
            where: { id }
        });

        res.json({
            mensagem: "Pessoa excluída com sucesso!"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao excluir pessoa"
        });
    }
});

app.get("/clientes", async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({
            include: {
                pessoa: true
            }
        });

        res.json(clientes);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar clientes"
        });
    }
});

app.get("/clientes/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const cliente = await prisma.cliente.findUnique({
            where: { id },
            include: {
                pessoa: true
            }
        });

        if (!cliente) {
            return res.status(404).json({
                erro: "Cliente não encontrado"
            });
        }

        res.json(cliente);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar cliente"
        });
    }
});

app.post("/clientes", async (req, res) => {
    try {
        const { pessoaId } = req.body;

        const cliente = await prisma.cliente.create({
            data: {
                pessoaId
            },
            include: {
                pessoa: true
            }
        });

        res.status(201).json(cliente);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao cadastrar cliente"
        });
    }
});

app.put("/clientes", async (req, res) => {
    try {
        const { id, pessoaId } = req.body;

        const cliente = await prisma.cliente.update({
            where: { id },
            data: {
                pessoaId
            },
            include: {
                pessoa: true
            }
        });

        res.json(cliente);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao atualizar cliente"
        });
    }
});

app.delete("/clientes/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.cliente.delete({
            where: { id }
        });

        res.json({
            mensagem: "Cliente excluído com sucesso!"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao excluir cliente"
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});