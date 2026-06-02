# Pessegos em Setembro

Blog editorial construído com Next.js App Router, TypeScript, Tailwind CSS e Sanity Content Lake. O projeto entrega o site público do **Pessegos em Setembro**, uma revista/diário literário digital com foco em leitura confortável, identidade visual autoral, conteúdo publicado pelo Sanity e deploy simples em ambiente serverless.

O Sanity Studio não vive neste repositório. Este app consome apenas conteúdo publicado do Sanity e expõe uma rota segura de revalidação para manter o cache atualizado sem rebuild completo.

## Sumário

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Rotas](#rotas)
- [Modelo de conteúdo](#modelo-de-conteúdo)
- [Cache e revalidação](#cache-e-revalidação)
- [Segurança](#segurança)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Como rodar localmente](#como-rodar-localmente)
- [Scripts](#scripts)
- [Testes e qualidade](#testes-e-qualidade)
- [Deploy](#deploy)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Troubleshooting](#troubleshooting)

## Visão geral

O objetivo do projeto é oferecer uma experiência editorial leve e elegante para leitura de crônicas, ensaios e textos culturais. A aplicação foi desenhada para custo operacional baixo: conteúdo no Sanity hosted, site público em Next.js, imagens pelo Sanity Image CDN e cache por tags no Next.

Principais decisões:

- Site público em Next.js App Router.
- Conteúdo gerenciado fora do repo, no Sanity Studio hosted.
- Sem login, painel administrativo ou Studio embutido neste app.
- Server Components por padrão.
- Queries centralizadas em `src/sanity/queries.ts`.
- Wrapper único de fetch em `src/sanity/client.ts`.
- Revalidação incremental via `POST /api/revalidate`.
- Segurança aplicada no runtime por sanitização de links, segredo de webhook e headers HTTP.

## Funcionalidades

- Home editorial com post em destaque, posts recentes, categorias e sidebar.
- Listagem de posts publicados.
- Página individual de post com Portable Text, imagem de capa, data e tempo de leitura.
- Página de categoria com posts relacionados.
- Busca pública simples por título, resumo e categoria.
- Página "Sobre" alimentada pelo Sanity.
- Layout responsivo mobile-first.
- Tema claro/escuro.
- Sitemap e robots gerados pelo Next.
- Revalidação por tags a partir de webhook do Sanity.
- Fallbacks para conteúdo ausente, imagem ausente e erros de fetch do Sanity.

## Stack

### Runtime

- Next.js `16.2.x`
- React `19.2.x`
- TypeScript
- Tailwind CSS
- `@sanity/client`
- `@sanity/image-url`
- `@portabletext/react`
- `@portabletext/types`
- `next/image`

### Qualidade e testes

- ESLint
- Vitest
- React Testing Library
- jsdom
- `npm audit` com override de `postcss` para evitar versão transitiva vulnerável

## Arquitetura

```text
Sanity Studio hosted
        |
        | conteúdo publicado
        v
Sanity Content Lake + Image CDN
        |
        | @sanity/client / GROQ
        v
Next.js App Router
        |
        | cache por tags
        v
Vercel / next start
```

O app centraliza o acesso ao Sanity em `sanityFetch`, que aplica tags de cache e fallback controlado:

- Se a configuração do Sanity estiver ausente, retorna fallback.
- Se o fetch falhar, registra erro no servidor e retorna fallback.
- As páginas passam tags compatíveis com o conteúdo consultado.

## Rotas

| Rota | Tipo | Descrição |
| --- | --- | --- |
| `/` | pública | Home editorial com destaque, posts recentes e sidebar. |
| `/posts` | pública | Lista de posts publicados. |
| `/posts/[slug]` | pública dinâmica | Página individual de post. |
| `/categorias/[slug]` | pública dinâmica | Página de categoria. |
| `/busca?q=termo` | pública dinâmica | Busca simples por termo. |
| `/sobre` | pública | Página institucional/autoral. |
| `/api/revalidate` | API | Webhook seguro para revalidação por tags. |
| `/sitemap.xml` | metadata | Sitemap gerado a partir de posts e categorias. |
| `/robots.txt` | metadata | Regras públicas de indexação. |

## Modelo de conteúdo

Os schemas do Sanity não ficam neste repositório, mas o app espera estes documentos no Content Lake:

### `post`

- `title`
- `slug`
- `excerpt`
- `publishedAt`
- `featured`
- `mainImage`
- `category`
- `body`
- `seo`

### `category`

- `title`
- `slug`
- `description`
- `color`

### `settings`

- `title`
- `description`
- `socialLinks`
- `newsletterText`
- `quote`
- `seo`

### `about`

- `title`
- `body`
- `seo`

## Cache e revalidação

A aplicação usa cache por tags do Next:

| Tag | Usada por |
| --- | --- |
| `post` | Home, listagem, busca, páginas de post e sitemap. |
| `category` | Categorias, cards, listagens e sitemap. |
| `settings` | Footer, sidebar e dados editoriais globais. |
| `about` | Página sobre. |

O endpoint `POST /api/revalidate` recebe payloads de webhook do Sanity, valida a assinatura oficial gerada a partir do campo **Secret** do webhook e chama `revalidateTag(tag, 'max')` para as tags afetadas.

No Sanity, configure o webhook com:

- URL: `https://seu-dominio.com/api/revalidate`
- Method: `POST`
- Secret: mesmo valor de `SANITY_REVALIDATE_SECRET`
- Trigger/projection conforme os documentos que devem revalidar o site

O app valida o header oficial `sanity-webhook-signature` usando `@sanity/webhook`. O segredo bruto não deve ser enviado por query string nem por header customizado.

Exemplo de payload esperado após a assinatura ser validada:

```json
{
  "_type": "post",
  "operation": "update"
}
```

## Segurança

Medidas implementadas:

- `SANITY_REVALIDATE_SECRET` obrigatório para revalidação.
- Webhook autenticado por assinatura oficial do Sanity.
- O segredo bruto nunca é aceito por query string ou header customizado.
- Links vindos do CMS passam por `safeHref`.
- Protocolos perigosos como `javascript:`, `data:` e `vbscript:` são rejeitados.
- Links inválidos de Portable Text são renderizados como texto, não como `<a>`.
- Links sociais inválidos não são renderizados.
- Headers HTTP globais:
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- `unsafe-eval` é permitido apenas fora de produção para compatibilidade com React/Next em modo development.
- `npm audit --omit=dev` deve retornar `0 vulnerabilities`.

## Variáveis de ambiente

Crie um `.env.local` ou `.env` com base em `.env.example`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-31
SANITY_REVALIDATE_SECRET=
```

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sim | ID do projeto Sanity. |
| `NEXT_PUBLIC_SANITY_DATASET` | Sim | Dataset usado pelo site, normalmente `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sim | Versão da API do Sanity. |
| `SANITY_REVALIDATE_SECRET` | Sim em produção | Segredo usado pelo webhook de revalidação. |

Sem as variáveis públicas do Sanity, o app sobe com fallbacks vazios para evitar quebra total da UI.

## Como rodar localmente

### Pré-requisitos

- Node.js compatível com Next.js 16.
- npm.
- Projeto e dataset no Sanity.

### Instalação

```bash
npm install
```

### Ambiente

```bash
cp .env.example .env.local
```

Preencha os valores do Sanity e o segredo de revalidação.

### Desenvolvimento

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

### Produção local

```bash
npm run build
npm run start
```

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o Next em modo desenvolvimento. |
| `npm run build` | Gera build de produção. |
| `npm run start` | Serve o build de produção. |
| `npm run lint` | Executa ESLint. |
| `npm run test` | Executa testes com Vitest. |
| `npm run test:watch` | Executa Vitest em modo watch. |

## Testes e qualidade

Testes existentes cobrem:

- Cálculo de tempo de leitura.
- Formatação de data.
- Mapeamento de tags de revalidação.
- Sanitização de URLs.
- Portable Text com links seguros e inseguros.
- Rota de revalidação.
- CSP em desenvolvimento vs produção.
- Corpo de post `null` vindo do Sanity.

Comandos recomendados antes de abrir PR ou fazer deploy:

```bash
npm run lint
npm run test
npm run build
npm audit --omit=dev
```

## Deploy

O destino natural do projeto é a Vercel.

Checklist de deploy:

1. Configurar variáveis de ambiente na Vercel.
2. Garantir que o dataset do Sanity esteja público ou acessível conforme o modo de consumo.
3. Configurar webhook no Sanity para `POST /api/revalidate`.
4. Preencher o campo **Secret** do webhook com `SANITY_REVALIDATE_SECRET`.
5. Rodar `npm run build` antes do deploy quando possível.

## Estrutura de pastas

```text
app/
  (site)/
    page.tsx
    posts/
    categorias/
    busca/
    sobre/
    globals.css
  api/
    revalidate/
  robots.ts
  sitemap.ts

src/
  components/
  lib/
  sanity/

docs/
  superpowers/
```

### Diretórios principais

- `app/(site)`: rotas públicas e layout do site.
- `app/api/revalidate`: webhook de revalidação.
- `src/components`: componentes de interface e composição editorial.
- `src/lib`: helpers puros, SEO, segurança e utilidades.
- `src/sanity`: client, queries, tipos e imagens do Sanity.
- `docs/superpowers`: especificações e planos usados durante a construção.

## Troubleshooting

### `eval() is not supported in this environment`

Em desenvolvimento, React/Next pode precisar de `eval()` para ferramentas de debugging. A CSP do projeto permite `unsafe-eval` apenas fora de produção. Se o erro aparecer, reinicie o servidor dev após atualizar `next.config.ts`.

### `Cannot read properties of null (reading 'map')`

Esse caso ocorre quando o Sanity retorna `body: null`. A função de leitura de Portable Text trata `null` e retorna string vazia. Se reaparecer, verifique se o build está usando a versão atual de `app/(site)/posts/[slug]/page.tsx`.

### Webhook retorna `401`

Verifique:

- `SANITY_REVALIDATE_SECRET` configurado no ambiente.
- Campo **Secret** configurado no webhook do Sanity.
- Header `sanity-webhook-signature` presente na requisição.
- O segredo bruto não deve ser enviado via query string nem por header manual.

### Imagens não aparecem

Verifique:

- Se o asset existe no Sanity.
- Se `NEXT_PUBLIC_SANITY_PROJECT_ID` e `NEXT_PUBLIC_SANITY_DATASET` estão corretos.
- Se o domínio `cdn.sanity.io` está permitido em `next.config.ts`.

## Licença

Projeto privado. Defina uma licença antes de publicar ou distribuir o código.
