# ReUse Brechó

Catálogo de roupas e painel de cadastro desenvolvidos com **HTML, CSS e JavaScript puro**. Esta pasta é a entrega da **Etapa I de Front-end Vanilla**. A versão React/Supabase da loja é outro projeto.

O ReUse é um brechó online de João Pessoa (PB). Nesta etapa, o projeto permite visualizar peças, buscar e filtrar produtos, usar a sacola e gerenciar um catálogo de demonstração.

## Executar

Instale o Node.js, abra esta pasta no terminal e execute:

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite (geralmente `http://localhost:5173/`).

- **Início:** `index.html`
- **Catálogo e sacola:** `catalogo.html`
- **Admin / CRUD:** `admin.html` (digite o endereço diretamente; não há link na navegação da loja)

Para checar o código:

```bash
npm test
npm run build
```

`npm run build` cria a pasta `dist/`, usada para publicar o projeto. O arquivo `vite.config.js` configura as três páginas como entradas da compilação.

## Critérios do Projeto 1.1

| Requisito | Arquivos de referência | Como demonstrar |
|---|---|---|
| `map`, `filter`, `reduce` (15 pts) | `src/utils/products.js`, `src/pages/catalog.js`, `src/pages/admin.js` | Pesquisar uma peça; filtrar por categoria; adicionar à sacola e observar a soma |
| Módulos ESM (10 pts) | `src/components`, `src/pages`, `src/services`, `src/data` | Mostrar `import` e `export` e explicar responsabilidades |
| Dados em arrays / LocalStorage (20 pts) | `src/data/seed.js`, `src/services/store.js` | Cadastrar peça e recarregar a página sem perder o registro |
| DOM manual + CRUD (20 pts) | `src/components/dom.js`, `src/components/productCard.js`, `src/pages/admin.js` | Inspecionar `createElement`, `appendChild` e realizar cadastro, edição e exclusão |
| Eventos (20 pts) | `src/pages/catalog.js`, `src/pages/admin.js` | Buscar digitando, selecionar filtros, clicar em botões e enviar formulário |
| Vite Vanilla (15 pts) | `package.json`, `vite.config.js` | Executar `npm run dev` e mostrar que não há React/Vue/Angular |

**Observação:** a pontuação real será definida pelo professor. Os recursos acima estão implementados para demonstração dos critérios técnicos.

## Organização dos arquivos

```text
reuse-brecho-vanilla/
├── index.html                 Página inicial
├── catalogo.html              Catálogo, filtros e sacola
├── admin.html                 Cadastro, edição, exclusão e pedidos de teste
├── public/assets/             Logo e fotografias ilustrativas das peças
├── src/
│   ├── components/            Elementos criados via DOM
│   ├── data/                  Categorias e produtos iniciais
│   ├── pages/                 Eventos e comportamento de cada página
│   ├── services/store.js      Leitura/gravação do LocalStorage e operações de dados
│   ├── styles/main.css        Layout responsivo
│   └── utils/                 Busca, ordenação, soma e formatação
├── tests/app.test.js          Testes de regras e persistência
├── vite.config.js
└── package.json
```

## O que está funcionando

- Cadastro, listagem, atualização e exclusão de produtos no painel.
- Busca de texto, filtros por categoria e tamanho e ordenação por preço/nome.
- Geração dos cards com `document.createElement()` e `appendChild()`.
- Favoritos e sacola com persistência local.
- Cálculo de totais e pedidos **de teste**, com atualização simulada do estoque.
- Layout adaptado para telas menores, formulários identificados e estado vazio.

Os seis produtos iniciais são **exemplos fictícios**, com imagens em estilo fotográfico geradas para esta apresentação; não representam peças reais do brechó. O botão **Restaurar exemplos** no Admin volta aos dados iniciais; ele apaga as alterações locais feitas nessa versão de demonstração.

## Imagens da demonstração

As imagens `public/assets/*.webp` mostram peças **fictícias** em estilo fotográfico. Foram criadas para esta demonstração acadêmica; não são fotografias de produtos disponíveis para venda. Estão armazenadas localmente no projeto (não dependem de serviços externos).

O caminho `/admin.html` não aparece na navegação pública para separar a experiência do cliente do gerenciamento. **Isso não constitui autenticação ou proteção de acesso**: a versão Vanilla usa somente dados locais e qualquer pessoa que conheça o endereço pode acessá-lo.

Caso você tenha aberto uma versão anterior, os seis exemplos com imagens SVG serão atualizados automaticamente para `.webp`, preservando as fotos personalizadas e os produtos criados manualmente. O botão **Restaurar exemplos** substitui os dados locais pelos exemplos atuais.

## Limitações desta etapa

Não existe login no painel Vanilla nem conexão com o Supabase, pagamento real, envio ao WhatsApp ou reserva real de peças. Todos os dados ficam no `localStorage` deste navegador, inclusive pedidos de teste. Não cadastre dados pessoais reais na apresentação. A imagem enviada no formulário deve ter até 350 KB para não ultrapassar o espaço de armazenamento do navegador.

A versão React/Supabase do ReUse deve continuar em outra pasta; esta entrega não contém `.env.local` nem credenciais.

## Entrega em equipe

O trabalho também pede **repositório GitHub, GitHub Projects (Kanban) e commits dos integrantes**. Esses registros devem ser feitos pela equipe e corresponder ao trabalho realizado. Há um checklist em `KANBAN_GITHUB.md` e uma sugestão de apresentação em `ROTEIRO_APRESENTACAO.md`.
