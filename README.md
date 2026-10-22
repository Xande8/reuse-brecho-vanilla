# ReUse Brechó

O **ReUse Brechó** é uma aplicação web desenvolvida para organizar e divulgar peças de um brechó online de João Pessoa (PB).

O projeto conta com um catálogo de produtos, ferramentas de busca e filtragem, sacola de compras e uma área administrativa para gerenciamento das peças.

Esta versão foi desenvolvida com **HTML, CSS e JavaScript Vanilla**, utilizando o Vite como ferramenta de desenvolvimento. O objetivo é aplicar conceitos de programação front-end na construção de uma interface interativa e responsiva.

## Tecnologias utilizadas

- **HTML5:** estruturação das páginas.
- **CSS3:** estilização e responsividade.
- **JavaScript:** manipulação do DOM, eventos e regras da aplicação.
- **Vite:** ambiente de desenvolvimento e geração do build.
- **LocalStorage:** armazenamento local de produtos, favoritos, sacola e pedidos de teste.

O código utiliza módulos ECMAScript (ESM), com `import` e `export` para organizar as responsabilidades entre os arquivos.

## Funcionalidades

### Catálogo

- Listagem dinâmica de produtos.
- Busca por nome e características das peças.
- Filtros por categoria e tamanho.
- Ordenação por nome e preço.
- Visualização dos detalhes dos produtos.
- Adição de peças aos favoritos e à sacola.

### Painel administrativo

- Cadastro de produtos.
- Listagem e consulta das peças cadastradas.
- Edição das informações dos produtos.
- Exclusão de produtos.
- Gerenciamento dos dados utilizados na demonstração.

O painel pode ser acessado diretamente pelo endereço `/admin.html`.

### Sacola e pedidos

- Adição e remoção de produtos.
- Atualização de quantidades.
- Cálculo do valor total.
- Simulação de pedidos e atualização do estoque.

Os pedidos são utilizados apenas para testes. Não existe processamento de pagamentos ou integração com serviços externos nesta versão.

## Organização do projeto

```text
reuse-brecho-vanilla/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── utils/
├── tests/
├── index.html
├── catalogo.html
├── admin.html
├── package.json
└── vite.config.js
```

O JavaScript foi dividido de acordo com a responsabilidade de cada módulo:

- `components/`: criação dos elementos da interface.
- `data/`: categorias e produtos iniciais.
- `pages/`: funcionalidades e eventos de cada página.
- `services/`: operações de dados e persistência no LocalStorage.
- `styles/`: estilos e adaptação para diferentes telas.
- `utils/`: funções auxiliares de busca, filtragem, cálculos e formatação.

A interface é construída dinamicamente utilizando métodos nativos do DOM, como `createElement()` e `appendChild()`.

A manipulação dos produtos também utiliza métodos de arrays, incluindo `map()`, `filter()` e `reduce()`.

## Como executar

**Pré-requisito:** Node.js instalado.

Clone o repositório:

```bash
git clone https://github.com/Xande8/reuse-brecho-vanilla.git
```

Entre na pasta do projeto:

```bash
cd reuse-brecho-vanilla
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse o endereço apresentado no terminal, normalmente `http://localhost:5173/`.

### Testes e build

Para executar os testes automatizados:

```bash
npm test
```

Para gerar a versão de produção:

```bash
npm run build
```

O build é gerado na pasta `dist/`.

## Armazenamento dos dados

Os dados são armazenados no LocalStorage do navegador, permitindo que produtos cadastrados, favoritos e informações da sacola permaneçam disponíveis após atualizar a página.

O projeto inclui produtos fictícios com imagens ilustrativas para facilitar a demonstração das funcionalidades.

No painel administrativo, a opção **Restaurar exemplos** recupera os dados iniciais, substituindo as alterações locais.

Como esta versão não utiliza um servidor de banco de dados, as informações não são compartilhadas entre dispositivos ou navegadores. O painel administrativo também não possui autenticação.

## Organização das atividades

O desenvolvimento foi organizado no GitHub Projects, utilizando um quadro Kanban para acompanhar as tarefas da primeira etapa.

As atividades estão relacionadas à construção da interface, organização dos módulos, manipulação do DOM, implementação do CRUD, persistência de dados e testes.

**GitHub Projects:** [ReUse Brechó — Etapa I](https://github.com/users/Xande8/projects/3/views/1)

## Autor

**Xande8**

Projeto desenvolvido para a disciplina de Programação Web, como parte da primeira entrega de front-end com JavaScript Vanilla.