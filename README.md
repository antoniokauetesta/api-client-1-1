<div align="center">

# 👥 API Client 1 pra 1

### Sistema de cadastro de pessoas e clientes — Full Stack

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

<p>
  <img src="https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/licen%C3%A7a-ISC-blue?style=flat-square" alt="Licença" />
  <img src="https://img.shields.io/github/last-commit/antoniokauetesta/api-client-1-1?style=flat-square" alt="Último commit" />
  <img src="https://img.shields.io/github/languages/top/antoniokauetesta/api-client-1-1?style=flat-square" alt="Linguagem principal" />
</p>

[📖 Sobre](#-sobre-o-projeto) •
[✨ Funcionalidades](#-funcionalidades) •
[🛠️ Tecnologias](#️-tecnologias) •
[📁 Estrutura](#-estrutura-do-projeto) •
[🚀 Como rodar](#-como-rodar-o-projeto) •
[🔌 Endpoints](#-endpoints-da-api)

</div>

---

## 📖 Sobre o projeto

O **API Client 1.1** é uma aplicação **full stack** para gerenciar **pessoas** e **clientes**. O back-end é uma API REST construída com **Node.js + Express**, que usa **Prisma ORM** para conversar com um banco **PostgreSQL**. O front-end, feito em **React + Vite**, consome essa API com um formulário de cadastro e uma lista de usuários.

> 💡 Cada **Cliente** está vinculado a uma **Pessoa** (relação 1:1), então os dados pessoais ficam centralizados em um só lugar.

---

## ✨ Funcionalidades

- 👤 **CRUD completo de Pessoas** — criar, listar, buscar por ID, atualizar e remover
- 🧾 **CRUD completo de Clientes** — vinculados a uma pessoa existente
- 🔗 **Relacionamento 1:1** entre Pessoa e Cliente
- 🔒 **E-mail e CPF únicos** — evita cadastros duplicados
- 🩺 **Health check** — rota `/` confirma se o servidor e o banco estão no ar
- 🌐 **CORS habilitado** para integração com o front-end
- 📝 **Formulário de cadastro** em React com listagem automática

---

## 🛠️ Tecnologias

| Camada | Tecnologia | Uso |
| :----: | :--------- | :-- |
| 🖥️ **Front-end** | [React](https://react.dev/) + [Vite](https://vitejs.dev/) | Interface e build rápido |
| ⚙️ **Back-end** | [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) | API REST |
| 🗄️ **ORM** | [Prisma](https://www.prisma.io/) | Modelagem e acesso ao banco |
| 🐘 **Banco de dados** | [PostgreSQL](https://www.postgresql.org/) | Persistência dos dados |
| 🔧 **Utilitários** | `dotenv` • `cors` • `nodemon` • `pg` | Configuração e desenvolvimento |

---

## 📁 Estrutura do projeto

```bash
api-client-1-1/
├── 📂 backend/
│   ├── 📂 prisma/
│   │   ├── 📂 migrations/       # Histórico de migrations
│   │   └── 📄 schema.prisma     # Modelos Pessoa e Cliente
│   ├── 📂 src/
│   │   ├── 📂 lib/
│   │   │   └── 📄 prisma.ts     # Instância do Prisma Client
│   │   └── 📄 server.js         # Servidor Express e rotas
│   ├── 📄 prisma.config.ts
│   └── 📄 package.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📄 App.jsx           # Tela de cadastro e listagem
│   │   ├── 📄 App.css
│   │   └── 📄 main.jsx
│   ├── 📄 index.html
│   └── 📄 vite.config.js
│
└── 📄 package.json
```

---

## 🗃️ Modelo de dados

```prisma
model Pessoa {
  id      Int      @id @default(autoincrement())
  nome    String
  email   String   @unique
  cpf     String   @unique
  cliente Cliente?
}

model Cliente {
  id       Int    @id @default(autoincrement())
  pessoaId Int    @unique
  pessoa   Pessoa @relation(fields: [pessoaId], references: [id])
}
```

```mermaid
erDiagram
    PESSOA ||--o| CLIENTE : "pode ser"
    PESSOA {
        int id PK
        string nome
        string email UK
        string cpf UK
    }
    CLIENTE {
        int id PK
        int pessoaId FK
    }
```

---

## 🚀 Como rodar o projeto

### 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- 🟢 [Node.js](https://nodejs.org/) (versão 20 ou superior)
- 🐘 [PostgreSQL](https://www.postgresql.org/download/)
- 🔀 [Git](https://git-scm.com/)

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/antoniokauetesta/api-client-1-1.git
cd api-client-1-1
```

### 2️⃣ Configurar o back-end

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro da pasta `backend` com a URL do seu banco:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO?schema=public"
```

Rode as migrations e gere o Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

Inicie o servidor:

```bash
npm run dev
```

✅ A API estará disponível em **http://localhost:3000**

### 3️⃣ Configurar o front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ A interface estará disponível em **http://localhost:5173**

---

## 🔌 Endpoints da API

**URL base:** `http://localhost:3000`

### 🩺 Status

| Método | Rota | Descrição |
| :----: | :--- | :-------- |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat-square) | `/` | Verifica o servidor e a conexão com o banco |

### 👤 Pessoas

| Método | Rota | Descrição |
| :----: | :--- | :-------- |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat-square) | `/pessoas` | Lista todas as pessoas (com cliente) |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat-square) | `/pessoas/:id` | Busca uma pessoa pelo ID |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat-square) | `/pessoas` | Cria uma nova pessoa |
| ![PUT](https://img.shields.io/badge/PUT-FCA130?style=flat-square) | `/pessoas` | Atualiza uma pessoa |
| ![DELETE](https://img.shields.io/badge/DELETE-F93E3E?style=flat-square) | `/pessoas/:id` | Remove uma pessoa |

### 🧾 Clientes

| Método | Rota | Descrição |
| :----: | :--- | :-------- |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat-square) | `/clientes` | Lista todos os clientes |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat-square) | `/clientes/:id` | Busca um cliente pelo ID |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat-square) | `/clientes` | Cria um novo cliente |
| ![PUT](https://img.shields.io/badge/PUT-FCA130?style=flat-square) | `/clientes` | Atualiza um cliente |
| ![DELETE](https://img.shields.io/badge/DELETE-F93E3E?style=flat-square) | `/clientes/:id` | Remove um cliente |

### 📨 Exemplos de requisição

<details>
<summary><b>➕ Criar pessoa (POST /pessoas)</b></summary>

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cpf": "123.456.789-00"
}
```

</details>

<details>
<summary><b>✏️ Atualizar pessoa (PUT /pessoas)</b></summary>

```json
{
  "id": 1,
  "nome": "Maria Souza",
  "email": "maria.souza@email.com",
  "cpf": "123.456.789-00"
}
```

</details>

---

## 🤝 Contribuindo

Contribuições são bem-vindas! 🎉

1. 🍴 Faça um **fork** do projeto
2. 🌿 Crie uma branch: `git checkout -b feature/minha-feature`
3. 💾 Commit suas mudanças: `git commit -m "feat: minha nova feature"`
4. 📤 Envie para a branch: `git push origin feature/minha-feature`
5. 🔃 Abra um **Pull Request**

---

<div align="center">

Feito por **[Antonio Kauê](https://github.com/antoniokauetesta)**

</div>
