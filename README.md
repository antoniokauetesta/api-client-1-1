# api-client-1-1

## Frontend

O painel React de clientes fica em `/clientes`. Para compilar a interface e iniciar
o servidor backend:

```sh
npm run dev
```

Acesse `http://localhost:3000/clientes`. Para desenvolver a interface com Vite,
inicie o backend em um terminal e execute `npm run dev:frontend` em outro; o Vite
fica disponível em `http://localhost:5173/clientes` e encaminha `/pessoas` ao backend.

O painel exibe nome e e-mail, mascara o CPF e informa que a senha não é armazenada.

## Criar cadastro pela API

Envie um `POST /pessoas` com `nome`, `email` e `cpf`:

```json
{
  "nome": "Maria Silva",
  "email": "maria@example.com",
  "cpf": "123.456.789-00"
}
```

A API normaliza o CPF para os 11 dígitos, valida os campos e cria a pessoa e seu
e-mail juntos. Retorna `201` quando criado, `400` para dados inválidos e `409`
quando o CPF ou e-mail já existe. O formulário também está disponível na página
`/clientes`. O modelo atual não armazena senhas.