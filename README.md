# auth

Estudo de autenticação no front-end com Next.js: login com e-mail e senha, token JWT salvo em cookie, renovação automática com refresh token e redirecionamento para um dashboard protegido.

Projeto desenvolvido durante a trilha Ignite ReactJS da Rocketseat, com código escrito por mim ao longo das aulas.

## O que tem aqui

- `AuthContext` que faz o login, guarda o usuário e recupera a sessão ao recarregar a página.
- Cookies gerenciados com nookies, para funcionar tanto no navegador quanto no server-side do Next.js.
- Interceptor do axios que detecta token expirado (401) e chama a rota de refresh antes de repetir a requisição.
- Página de dashboard que só carrega com usuário autenticado.

## Stack

Next.js, React, TypeScript, axios, nookies.

## Como rodar

Este front espera uma API em `http://localhost:3333` com as rotas `POST /sessions`, `POST /refresh` e `GET /me`. A API usada nas aulas foi fornecida pela Rocketseat e não está neste repositório.

```bash
yarn
yarn dev
```

## Status

Exercício de estudo de 2022, concluído até a etapa de refresh token. Mantido como referência de fluxo de autenticação com cookies em Next.js.
