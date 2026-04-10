# API Social

Esta API simula uma rede social, permitindo o cadastro de usuários, autenticação, criação e gerenciamento de postagens.
Documentação detalhada em https://documenter.getpostman.com/view/43110445/2sBXitC7Qc

## Tecnologias

- Node.js
- Express
- PostgreSQL
- JWT (`jsonwebtoken`)
- BCrypt (`bcrypt`)
- Joi para validação
- CORS
- dotenv

## Estrutura do projeto

- `server.js` - entrada principal da aplicação
- `src/app.js` - configuração do Express
- `src/config/routes.js` - definição das rotas da API
- `src/config/db.js` - pool de conexão com PostgreSQL
- `src/auth/authLogin.js` - middleware de autenticação JWT
- `src/validation/usuarios.js` - validação de cadastro de usuários
- `src/validation/posts.js` - validação de postagens

## Instalação

1. Clone o repositório.
2. Execute:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz com as variáveis abaixo.

### Variáveis de ambiente

```dotenv
DATABASE_URL=link_do_bd
PORT=3000
JWT_SECRET=uma_chave_secreta_forte
```

> Observação: no exemplo atual do projeto, a URL do banco deve usar `postgresql://` e não `postrgresql://`.

## Banco de dados

A aplicação se conecta ao PostgreSQL usando `src/config/db.js`.

### Tabelas esperadas

#### `usuarios`
- `id`
- `nome`
- `email`
- `senha`

#### `posts`
- `id`
- `titulo`
- `conteudo`
- `usuario_id`
- `criado_em`

> A aplicação não inclui migrações; crie as tabelas manualmente ou via SQL.

## Scripts

- `npm start` - executa a aplicação
- `npm run dev` - executa com `nodemon`

## Rotas da API

### `POST /usuarios`
Cadastro de usuário.

Request body:
```json
{
  "nome": "João",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

Respostas:
- `201` - usuário criado com sucesso
- `400` - erro de validação
- `500` - erro no servidor

### `POST /login`
Login de usuário.

Request body:
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

Respostas:
- `200` - retorna `{ "token": "<JWT>" }`
- `400` - usuário não encontrado ou senha inválida

### `GET /`
Retorna uma página simples de boas-vindas.

### `GET /usuarios`
Retorna todos os usuários.

Respostas:
- `200` - lista de usuários
- `500` - erro no servidor

### `GET /posts`
Retorna todas as postagens com o nome do usuário e data formatada.

Respostas:
- `200` - lista de posts
- `500` - erro no servidor

### `POST /posts`
Cria um novo post. Requer autenticação.

Headers:
```http
Authorization: Bearer <token>
```

Request body:
```json
{
  "titulo": "Meu post",
  "conteudo": "Texto do post"
}
```

Respostas:
- `201` - post criado
- `400` - erro de validação
- `401` - token ausente ou inválido
- `500` - erro no servidor

### `PUT /posts/:id`
Atualiza um post existente. Requer autenticação e propriedade do post.

Headers:
```http
Authorization: Bearer <token>
```

Request body:
```json
{
  "titulo": "Novo título",
  "conteudo": "Novo conteúdo"
}
```

Respostas:
- `201` - post atualizado
- `403` - sem permissão
- `404` - post não encontrado
- `500` - erro no servidor

### `DELETE /posts/:id`
Deleta um post existente. Requer autenticação e propriedade do post.

Headers:
```http
Authorization: Bearer <token>
```

Respostas:
- `201` - post deletado
- `403` - sem permissão
- `404` - post não encontrado
- `500` - erro no servidor

## Autenticação

- JWT é gerado em `POST /login` usando `JWT_SECRET`
- Middleware `src/auth/authLogin.js` valida o header `Authorization`
- O token deve ser enviado no formato:
  ```http
  Authorization: Bearer <token>
  ```

## Validação

### Usuário
- `nome`: string, mínimo 3 caracteres
- `email`: e-mail válido
- `senha`: string, mínimo 6 caracteres

### Post
- `titulo`: string, mínimo 3 caracteres
- `conteudo`: string, mínimo 5 caracteres

## Observações

- A senha do usuário é salva como hash com `bcrypt`.
- O middleware `auth` adiciona `req.usuario` com o `id` do usuário autenticado.
- O projeto usa CORS global e json middleware.
