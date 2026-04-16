# Mural de Compromissos Sustentáveis

Aplicação web para registro, acompanhamento e visualização de compromissos ESG (Ambiental, Social e Governança) de colaboradores em ambientes industriais.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Arquitetura](#arquitetura)
- [Módulos JavaScript](#módulos-javascript)
- [Estrutura de Dados](#estrutura-de-dados)
- [Interface](#interface)
- [Acessibilidade e Segurança](#acessibilidade-e-segurança)
- [Evoluções Futuras](#evoluções-futuras)

---

## Visão Geral

O **Mural de Compromissos Sustentáveis** permite que colaboradores registrem e acompanhem ações individuais e coletivas ligadas às metas ESG da organização, promovendo engajamento e visibilidade das iniciativas sustentáveis.

A aplicação é totalmente **client-side** — sem servidor, sem banco de dados externo. Todos os dados são persistidos no `localStorage` do navegador.

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Cadastro de compromissos | Modal com formulário completo |
| Edição de compromissos | Reabre o modal pré-preenchido |
| Exclusão com confirmação | Diálogo de confirmação antes de remover |
| Visualização em cards | Grid responsivo 1/2/3 colunas |
| Filtro por setor | Select populado dinamicamente |
| Filtro por categoria ESG | Ambiental, Social ou Governança |
| Filtro por status | Planejado, Em Andamento ou Concluído |
| Busca textual | Pesquisa em nome, setor, descrição e impacto |
| Indicadores (KPIs) | 8 métricas: totais, percentual e distribuição ESG |
| Persistência local | Dados salvos no `localStorage` do navegador |

---

## Tecnologias

| Tecnologia | Versão / Fonte | Finalidade |
|---|---|---|
| HTML5 | — | Estrutura semântica |
| Tailwind CSS | CDN (latest) | Estilização responsiva |
| JavaScript ES6+ | Vanilla (sem frameworks) | Lógica da aplicação |
| localStorage API | Nativa do navegador | Persistência de dados |

Sem dependências de build — nenhum `npm install` necessário.

---

## Estrutura do Projeto

```
mural-compromissos-sustentaveis/
│
├── index.html          # Ponto de entrada — toda a estrutura HTML e o modal
│
├── js/
│   ├── storage.js      # Camada de dados: CRUD no localStorage
│   ├── ui.js           # Camada de renderização: cards, KPIs, filtros
│   └── app.js          # Camada de controle: eventos, formulário, filtros
│
├── css/
│   └── styles.css      # Estilos customizados complementares (reservado)
│
├── assets/
│   └── images/         # Logotipos e imagens da organização
│
├── README.md           # Esta documentação
└── projeto_espec.md    # Especificação original do projeto
```

---

## Como Executar

### Opção 1 — Abrir diretamente no navegador

Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

> Não é necessário servidor web. A aplicação funciona via protocolo `file://`.

### Opção 2 — Servidor local simples (recomendado para desenvolvimento)

**Com Python:**
```bash
python -m http.server 8080
```

**Com Node.js (npx):**
```bash
npx serve .
```

Acesse `http://localhost:8080` no navegador.

---

## Arquitetura

A aplicação segue o padrão de separação em três camadas:

```
┌─────────────────────────────────────────────┐
│              index.html (View)              │
│  Estrutura HTML + Template do Modal         │
└────────────────────┬────────────────────────┘
                     │ DOM
┌────────────────────▼────────────────────────┐
│               app.js (Controller)           │
│  Eventos, filtros, orquestração             │
├──────────────┬──────────────────────────────┤
│   ui.js      │           storage.js         │
│  (Renderer)  │           (Repository)       │
│  Cards, KPIs │  getAll / addItem /          │
│  Filtros     │  updateItem / deleteItem     │
└──────────────┴──────────────────────────────┘
                     │ JSON
┌────────────────────▼────────────────────────┐
│              localStorage                   │
│  Chave: "mural_compromissos_sustentaveis"   │
└─────────────────────────────────────────────┘
```

**Fluxo de dados:**

```
Usuário preenche formulário
        ↓
app.js coleta e valida campos
        ↓
storage.js persiste no localStorage
        ↓
app.js chama loadAndRender()
        ↓
ui.js renderiza KPIs + cards filtrados
```

---

## Módulos JavaScript

### `js/storage.js`

Responsável exclusivamente pela persistência. Não conhece o DOM.

| Função | Descrição |
|---|---|
| `getAll()` | Retorna todos os compromissos |
| `addItem(item)` | Gera UUID e `dataCriacao`, salva e retorna o item |
| `updateItem(id, data)` | Mescla os campos atualizados e salva |
| `deleteItem(id)` | Remove o item pelo ID |
| `getById(id)` | Busca um item pelo ID |
| `saveAll(items)` | Serializa e grava o array completo |

**Chave de armazenamento:**
```js
const STORAGE_KEY = "mural_compromissos_sustentaveis";
```

---

### `js/ui.js`

Responsável pela renderização. Recebe dados e produz elementos DOM.

| Função | Descrição |
|---|---|
| `createCard(item)` | Cria e retorna um elemento `<div>` com o card completo |
| `renderMural(items)` | Limpa e repopula o grid `#mural-section` |
| `renderKPIs(items)` | Atualiza os 8 contadores de indicadores |
| `populateSetorFilter(items)` | Popula dinamicamente o `<select>` de setores |
| `escapeHtml(str)` | Sanitiza strings para evitar XSS |
| `formatDate(dateStr)` | Converte `YYYY-MM-DD` → `DD/MM/YYYY` |
| `getCategoryBadge(cat)` | Retorna classes Tailwind para o badge de categoria |
| `getStatusBadge(status)` | Retorna classes Tailwind para o badge de status |
| `getStatusIcon(status)` | Retorna o emoji correspondente ao status |

---

### `js/app.js`

Ponto de entrada da aplicação. Conecta as camadas de dados e UI.

| Função | Descrição |
|---|---|
| `loadAndRender()` | Carrega dados, atualiza filtros de setor, KPIs e mural |
| `openModal(editId?)` | Abre o modal; se `editId` for fornecido, pré-preenche o formulário |
| `closeModal()` | Fecha o modal e limpa o estado de edição |
| `editItem(id)` | Dispara a abertura do modal em modo edição (chamado pelos cards) |
| `confirmDelete(id)` | Exibe confirmação e, se aceito, deleta e re-renderiza |
| `applyFilters(items)` | Aplica todos os filtros ativos e retorna o array filtrado |
| `applyAndRender()` | Lê os filtros atuais e re-renderiza tudo |

---

## Estrutura de Dados

Cada compromisso é armazenado como objeto JSON:

```json
{
  "id": "a3f2c1d4-...",
  "nome": "João Silva",
  "setor": "Produção",
  "categoria": "Ambiental",
  "descricao": "Reduzir o consumo de água na linha de produção",
  "dataPrevista": "2026-05-10",
  "status": "Planejado",
  "impacto": "Redução de 10% no consumo de água",
  "dataCriacao": "2026-04-16T10:00:00.000Z"
}
```

| Campo | Tipo | Obrigatório | Valores aceitos |
|---|---|---|---|
| `id` | string (UUID v4) | auto | gerado em `addItem` |
| `nome` | string | sim | texto livre |
| `setor` | string | sim | texto livre |
| `categoria` | string | sim | `Ambiental`, `Social`, `Governança` |
| `descricao` | string | sim | texto livre |
| `dataPrevista` | string | não | formato `YYYY-MM-DD` |
| `status` | string | sim | `Planejado`, `Em andamento`, `Concluído` |
| `impacto` | string | não | texto livre |
| `dataCriacao` | string (ISO 8601) | auto | gerado em `addItem` |

---

## Interface

### Paleta de Cores

| Elemento | Classe Tailwind | Hex aproximado |
|---|---|---|
| Fundo da página | `bg-gray-900` | `#111827` |
| Cards e painéis | `bg-gray-800` | `#1F2937` |
| Header | `bg-blue-900` | `#1E3A5F` |
| Botão principal | `bg-emerald-600` | `#059669` |
| Texto principal | `text-gray-100` | `#F3F4F6` |
| Status Concluído | `text-green-400` | `#4ADE80` |
| Status Em Andamento | `text-yellow-400` | `#FACC15` |
| Status Planejado | `text-blue-400` | `#60A5FA` |
| Badge Ambiental | `bg-emerald-600` | `#059669` |
| Badge Social | `bg-blue-500` | `#3B82F6` |
| Badge Governança | `bg-purple-500` | `#A855F7` |

### Responsividade

| Breakpoint | Colunas do Mural |
|---|---|
| Mobile (`< 768px`) | 1 coluna |
| Tablet (`≥ 768px`) | 2 colunas |
| Desktop (`≥ 1024px`) | 3 colunas |

---

## Acessibilidade e Segurança

### Acessibilidade
- Modal com `role="dialog"`, `aria-modal="true"` e `aria-labelledby`
- Botões de editar/excluir com `aria-label` descritivos
- Foco movido para o modal ao abrir
- Fechamento com tecla **Escape**
- Suporte a navegação por teclado com `focus-visible`
- Contraste elevado entre texto e fundos (modo escuro)

### Segurança
- Toda string renderizada no DOM passa por `escapeHtml()`, prevenindo ataques XSS
- Dados armazenados apenas localmente (sem transmissão a servidores externos)
- Campos de formulário com `novalidate` — validação nativa HTML5 mantida via `required`

---

## Evoluções Futuras

| Funcionalidade | Complexidade estimada |
|---|---|
| Exportação em PDF/Excel | Média |
| Gráficos de distribuição ESG (Chart.js) | Baixa |
| Backend com Node.js + PostgreSQL | Alta |
| Autenticação via SSO corporativo | Alta |
| Integração com SAP / Power BI | Alta |
| Gamificação com ranking de colaboradores | Média |
| Notificações de prazo próximo | Baixa |
| Modo claro/escuro | Baixa |

---

## Licença

Destinado a fins educacionais e de prototipação. Pode ser adaptado para uso corporativo conforme as políticas internas da organização.
