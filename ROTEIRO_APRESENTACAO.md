# Roteiro de apresentação — Projeto 1.1

Tempo sugerido: **6 a 8 minutos**. Nesta etapa, mostre o **código Vanilla**, não a versão React.

## 1. Introdução (40 s)

“Este é o ReUse Brechó, um catálogo online voltado para a divulgação de roupas de segunda mão em João Pessoa. Na primeira entrega, desenvolvemos as telas de catálogo e administração usando HTML, CSS e JavaScript puro.”

Abra `index.html` no navegador e apresente rapidamente a navegação.

## 2. Estrutura e Vite (1 min)

No VS Code, abra `package.json` e `vite.config.js`. Mostre os scripts `dev` e `build`, o uso de **Vite Vanilla** e a separação do código em `pages`, `components`, `services`, `data` e `utils`.

Em `src/pages/catalog.js`, mostre um `import`. Em `src/utils/products.js`, mostre um `export`.

## 3. Dados e programação funcional (1 min)

Abra `src/data/seed.js` e explique o array de objetos de produtos. Em `src/services/store.js`, mostre a leitura e a escrita do `localStorage`.

Em `src/utils/products.js`, aponte `filter()` usado na busca, `map()` para associar as peças do carrinho aos dados e `reduce()` na soma do total. Demonstre uma busca no catálogo e acrescente uma peça à sacola.

## 4. Componentes e DOM manual (1 min)

Abra `src/components/dom.js` e `src/components/productCard.js`. Explique como cada cartão é criado via `document.createElement()`, preenchido com `textContent` e anexado por `appendChild()`.

Em `src/pages/catalog.js`, mostre `replaceChildren(...visible.map(...))`, que atualiza a grade de produtos.

## 5. Eventos e CRUD (2 min)

No navegador, abra `admin.html` e mostre o formulário. Cadastre um produto. Volte à listagem, edite o preço e depois exclua a peça de demonstração. Atualize a página: os dados não somem enquanto estiverem no LocalStorage.

No código, destaque os `addEventListener('submit')`, `addEventListener('click')` e `addEventListener('change')` usados nos formulários e botões.

## 6. Estilo e responsividade (40 s)

Mostre o catálogo em tela de computador e em uma largura menor usando as ferramentas de desenvolvedor (`F12`). Mostre os `@media` em `src/styles/main.css`.

## 7. Fechamento (30 s)

“Esta etapa implementa a interface e as operações locais de demonstração. O objetivo foi aplicar os conceitos da disciplina: módulos, manipulação do DOM, eventos, operações em arrays e persistência no navegador. Uma evolução futura pode utilizar um backend para armazenar dados compartilhados.”

## Antes de apresentar

- [ ] `npm install` e `npm run dev` funcionam.
- [ ] `npm test` termina sem falhas.
- [ ] A logo e os desenhos de produtos carregam.
- [ ] Cadastro, edição e exclusão foram ensaiados.
- [ ] O Kanban e os commits reais estão organizados no GitHub.

Não afirme que há pagamentos ou pedidos reais: nesta versão são simulações locais.
