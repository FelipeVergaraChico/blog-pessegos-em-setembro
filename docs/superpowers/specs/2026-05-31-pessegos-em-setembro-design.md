# Pessegos em Setembro: Design do Produto e Arquitetura

Data: 2026-05-31

## Objetivo

Construir o MVP do blog **Pessegos em Setembro**, uma revista/diario literario digital com identidade intima, editorial, elegante e autoral. O projeto prioriza custo zero, boa performance, publicacao simples pelo celular e uma experiencia de leitura confortavel.

O site publico sera um app Next.js na Vercel. A criacao e edicao de conteudo acontecerao no Sanity Studio hospedado pelo Sanity, fora deste repositorio.

## Escopo do MVP

### Incluido

- Home editorial.
- Lista publica de posts.
- Pagina individual de post.
- Pagina de categoria.
- Busca publica simples.
- Pagina sobre.
- Conteudo consumido do Sanity via `next-sanity`.
- Imagens enviadas no Sanity e renderizadas no site via Sanity Image CDN e `next/image`.
- Revalidacao por tags via webhook do Sanity para `/api/revalidate`.
- Bloco visual de newsletter sem envio real.
- Modo claro e escuro.

### Fora do MVP

- Login no Next.js.
- Painel `/admin`.
- CMS proprio.
- Sanity Studio dentro deste repositorio.
- Schemas do Sanity dentro deste repositorio.
- Comentarios, likes, favoritos ou contas de leitores.
- Newsletter real.
- Rebuild completo obrigatorio da Vercel a cada post.

## Stack

- Next.js App Router com TypeScript.
- Tailwind CSS para tokens visuais e responsividade.
- `next-sanity` para client, queries e integracao com o Content Lake.
- `@portabletext/react` para rich text dos posts.
- `next/image` com builder de URL do Sanity para imagens.
- Deploy na Vercel.
- Sanity Studio hosted fora do repo.

## Arquitetura

### Next.js na Vercel

O app Next.js sera apenas o site publico. Ele nao tera login, area administrativa ou Studio embutido. A aplicacao usara Server Components por padrao, queries centralizadas e cache por tags para manter boa performance e atualizacao rapida.

Rotas previstas:

- `app/(site)/page.tsx`
- `app/(site)/posts/page.tsx`
- `app/(site)/posts/[slug]/page.tsx`
- `app/(site)/categorias/[slug]/page.tsx`
- `app/(site)/busca/page.tsx`
- `app/(site)/sobre/page.tsx`
- `app/api/revalidate/route.ts`

Arquivos de suporte previstos:

- `src/sanity/client.ts`
- `src/sanity/queries.ts`
- `src/sanity/image.ts`
- `src/sanity/types.ts`
- `src/components/...`
- `src/lib/read-time.ts`
- `src/lib/seo.ts`
- `src/lib/format-date.ts`

### Sanity hosted

O Studio ficara hospedado pelo Sanity, fora deste repositorio. O login usado para publicar sera o login do Sanity. Este repositorio apenas consome dados publicados e, quando necessario, dados de preview em uma etapa futura.

Modelos esperados no Sanity:

- `post`: titulo, slug, resumo, conteudo rich text, imagem de capa com alt/hotspot, categoria, data de publicacao, destaque na home e SEO opcional.
- `category`: nome, slug, descricao curta e ordem/cor opcional.
- `settings`: nome do blog, descricao, links sociais, texto de newsletter, citacao lateral e SEO padrao.
- `about`: conteudo da pagina sobre.

Como o Studio nao vive neste repo, estes schemas sao contrato de integracao, nao arquivos a serem implementados aqui.

## Revalidacao e Cache

O Sanity chamara `POST /api/revalidate` quando documentos forem publicados ou alterados. A rota deve validar a assinatura/segredo do webhook antes de qualquer revalidacao.

Tags principais:

- `post`
- `category`
- `settings`
- `about`

Comportamento:

- Alteracoes em `post` revalidam listagens, home e paginas de posts.
- Alteracoes em `category` revalidam categorias, listagens e cards que exibem categoria.
- Alteracoes em `settings` revalidam layout, footer, SEO padrao e blocos editoriais.
- Alteracoes em `about` revalidam a pagina sobre.

A implementacao deve preferir `revalidateTag(tag, 'max')` para stale-while-revalidate. O endpoint deve retornar `401` para assinatura invalida e nao revalidar nada nesse caso.

## Experiencia Visual

A direcao visual e **Diario moderno acolhedor**: intima, editorial, elegante e autoral, mais proxima de um diario literario premium do que de um portal de noticias.

Modo claro:

- Fundo creme: `#F8F2EC`
- Texto cafe: `#3D2F2A`
- Pessego principal: `#E89A7D`
- Vinho: `#6B3E4A`
- Salvia: `#7A8B6F`
- Bege escuro: `#D7C8BC`
- Terracota: `#D87B58`

Modo escuro:

- Fundo: `#1C1817`
- Superficies: `#2A2422`
- Texto: `#F3ECE6`
- Pessego: `#E89A7D`
- Vinho claro: `#B86A7A`
- Salvia: `#92A887`

Tipografia:

- Titulos com Cormorant Garamond.
- Texto, navegacao e UI com Inter.
- Corpo de artigo com largura limitada, espacamento confortavel e hierarquia clara.

Componentes principais:

- Navbar minimalista com logo, navegacao discreta, busca e alternancia claro/escuro.
- Hero com artigo em destaque, imagem grande, titulo, resumo, data e tempo de leitura.
- Cards editoriais para posts.
- Areas editoriais com populares, categorias, newsletter visual e citacao.
- Footer simples com descricao e links.

Responsividade:

- Mobile-first.
- Sidebar pode existir no desktop.
- No mobile, conteudo lateral vira secoes abaixo do conteudo principal.
- Leitura confortavel pelo celular e prioridade.

Imagens:

- Upload via Sanity.
- Renderizacao com `next/image` usando Sanity Image CDN.
- Estetica de luz suave, cafe, livros, flores secas, por do sol e fotografia analogica.

## Fluxos

### Publicacao

1. O autor cria ou edita um post no Sanity Studio.
2. O conteudo permanece como rascunho ate ser publicado pelo Sanity.
3. Ao publicar ou alterar, o Sanity chama `/api/revalidate`.
4. O Next.js valida o webhook.
5. O cache das tags relevantes e marcado como stale.
6. O proximo acesso recebe conteudo atualizado sem rebuild completo da Vercel.

### Busca

A busca publica em `/busca` deve ser simples no MVP. Ela pode consultar posts publicados por termo em titulo, resumo e conteudo. Nao havera indexador externo no primeiro corte para manter custo zero.

### Newsletter

A newsletter sera apenas um bloco visual sem envio real no MVP. Se a integracao real entrar em uma fase futura, a opcao preferida e Brevo no plano gratuito, com formulario no Next.js enviando o e-mail para a API/integracao da Brevo.

## SEO

- Metadados por post com titulo, descricao, imagem social e canonical.
- Fallback de SEO vindo de `settings`.
- Open Graph e Twitter cards.
- Sitemap.
- Robots.
- URLs limpas por slug.

## Estados e Erros

- Sem posts: home mostra estado editorial vazio, sem parecer erro tecnico.
- Post nao encontrado: 404 com tom visual do blog.
- Imagem ausente: fallback visual elegante com cores creme/pessego.
- Webhook invalido: retorna 401 sem revalidar.
- Erro de Sanity em build/runtime: tratamento controlado para evitar quebra completa da UI.

## Qualidade

- Tipagem forte para dados consumidos do Sanity.
- Queries centralizadas.
- Componentes separados por responsabilidade.
- Tratamento de dados ausentes.
- Testes focados em funcoes puras, como tempo de leitura, helpers de SEO/data e validacao de webhook quando viavel.
- Verificacao com `npm run lint`, `npm run build` e teste visual no navegador.

## Decisoes Aprovadas

- Sanity hosted fora do repositorio.
- Este repo nao contem Studio nem schemas do Sanity.
- Next.js publico com App Router.
- ISR por tags via webhook seguro.
- Sem login no Next.js.
- Sem CMS proprio.
- Newsletter real fora do MVP.
