# 📌 Mural de Compromissos Sustentáveis

## 📖 Visão Geral

O **Mural de Compromissos Sustentáveis** é uma aplicação web que permite que colaboradores registrem, acompanhem e visualizem compromissos relacionados à sustentabilidade dentro de uma indústria.

A solução promove o engajamento com práticas ESG (Ambiental, Social e Governança), incentivando ações individuais e coletivas alinhadas às metas corporativas de empresas como ArcelorMittal ou CBMM.

---

## 🎯 Objetivos do Projeto

* Incentivar a cultura de sustentabilidade no ambiente industrial.
* Permitir o registro de compromissos individuais e coletivos.
* Acompanhar o progresso das ações sustentáveis.
* Fornecer visibilidade das iniciativas dentro da organização.
* Facilitar a replicação futura com integração a sistemas corporativos.

---

## 👥 Público-Alvo

* Colaboradores operacionais e administrativos.
* Gestores e líderes de equipe.
* Equipes de sustentabilidade e ESG.
* Setores de Saúde, Segurança e Meio Ambiente (SSMA).

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia                  | Finalidade                         |
| --------------------------- | ---------------------------------- |
| **HTML5**                   | Estrutura da aplicação             |
| **Tailwind CSS**            | Estilização responsiva e moderna   |
| **JavaScript (Vanilla)**    | Lógica da aplicação                |
| **Local Storage**           | Persistência de dados no navegador |
| **Lucide Icons (opcional)** | Ícones visuais                     |

---

## 🏗️ Estrutura de Pastas

```plaintext
mural-compromissos-sustentaveis/
│
├── index.html
├── css/
│   └── styles.css (opcional)
├── js/
│   ├── app.js
│   ├── storage.js
│   └── ui.js
├── assets/
│   └── images/
├── README.md
```

---

## ✨ Funcionalidades Principais

### 1. Cadastro de Compromissos

Permite que o colaborador registre um novo compromisso sustentável.

**Campos:**

* Nome do colaborador
* Setor/Departamento
* Tipo de compromisso (Ambiental, Social, Governança)
* Descrição da ação
* Data prevista
* Status (Planejado, Em andamento, Concluído)
* Impacto estimado (opcional)

---

### 2. Visualização do Mural

Exibição dos compromissos em formato de **cards**, com:

* Filtros por setor e categoria.
* Busca por palavras-chave.
* Ordenação por data ou status.

---

### 3. Atualização de Status

Permite editar compromissos e marcar como **concluídos**, incentivando o acompanhamento das metas.

---

### 4. Exclusão de Registros

Possibilidade de remover compromissos com confirmação para evitar exclusões acidentais.

---

### 5. Indicadores de Engajamento

Resumo com métricas simples:

* Total de compromissos.
* Percentual concluído.
* Distribuição por categoria ESG.

---

## 💾 Estrutura de Dados (Local Storage)

```json
{
  "id": "uuid",
  "nome": "João Silva",
  "setor": "Produção",
  "categoria": "Ambiental",
  "descricao": "Reduzir o consumo de água na linha de produção",
  "dataPrevista": "2026-05-10",
  "status": "Planejado",
  "impacto": "Redução de 10% no consumo de água",
  "dataCriacao": "2026-04-15T10:00:00"
}
```

**Chave de armazenamento:**

```javascript
const STORAGE_KEY = "mural_compromissos_sustentaveis";
```

---

## 🖥️ Estrutura da Interface

### 🔹 1. Cabeçalho

* Logotipo da empresa.
* Título do sistema.
* Descrição breve.

### 🔹 2. Formulário de Cadastro

* Inputs organizados em grid responsivo.
* Botão de submissão.

### 🔹 3. Filtros e Busca

* Select para setor e categoria.
* Campo de pesquisa textual.

### 🔹 4. Mural de Cards

Cada card deve conter:

* Nome do colaborador.
* Setor.
* Categoria ESG (com cor distinta).
* Descrição.
* Data prevista.
* Status.
* Botões de editar e excluir.

### 🔹 5. Painel de Indicadores

* Cards com métricas resumidas.
* Gráficos simples (opcional).

---

## 🎨 Diretrizes de Design (Tailwind)

| Elemento            | Sugestão      |
| ------------------- | ------------- |
| Cor primária        | `blue-900`    |
| Cor secundária      | `emerald-600` |
| Fundo               | `gray-900`    |
| Cards               | `gray-800`    |
| Texto               | `gray-100`    |
| Status concluído    | `green-500`   |
| Status em andamento | `yellow-500`  |
| Status planejado    | `blue-500`    |

---

## 🔐 Requisitos Não Funcionais

* **Responsividade** para uso em tablets industriais.
* **Acessibilidade** (contraste e navegação por teclado).
* **Performance** com carregamento rápido.
* **Privacidade**: dados armazenados localmente sem identificação sensível.
* **Escalabilidade** para futura integração com APIs corporativas.

---

## 🔄 Fluxo de Uso

```plaintext
[Usuário acessa]
        ↓
[Preenche o formulário]
        ↓
[Salva no Local Storage]
        ↓
[Compromisso exibido no mural]
        ↓
[Usuário pode editar ou concluir]
        ↓
[Indicadores são atualizados]
```

---

## 🧩 Estrutura Inicial do `index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mural de Compromissos Sustentáveis</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100">
  <header class="bg-blue-900 p-6 text-center">
    <h1 class="text-3xl font-bold">Mural de Compromissos Sustentáveis</h1>
    <p class="text-gray-300">Engajando colaboradores rumo a um futuro sustentável</p>
  </header>

  <main class="p-6 container mx-auto">
    <!-- Formulário -->
    <section id="form-section"></section>

    <!-- Indicadores -->
    <section id="metrics-section" class="mt-8"></section>

    <!-- Filtros -->
    <section id="filters-section" class="mt-8"></section>

    <!-- Mural -->
    <section id="mural-section" class="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6"></section>
  </main>

  <script src="js/storage.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## 🚀 Possíveis Evoluções Futuras

* Integração com APIs corporativas (SAP, Power BI).
* Autenticação via SSO corporativo.
* Exportação de relatórios em PDF/Excel.
* Dashboard analítico com gráficos.
* Backend com Node.js ou Firebase.
* Gamificação com pontuação e rankings.

---

## 📊 Indicadores ESG Sugeridos

* Redução de consumo de água.
* Economia de energia.
* Diminuição de resíduos.
* Ações sociais realizadas.
* Participação de colaboradores.

---

## 📝 Critérios de Aceitação

* [ ] Permitir cadastro de novos compromissos.
* [ ] Persistir dados utilizando Local Storage.
* [ ] Exibir compromissos em formato de cards.
* [ ] Possibilitar edição e exclusão.
* [ ] Implementar filtros e busca.
* [ ] Apresentar indicadores de engajamento.
* [ ] Interface responsiva e acessível.

---

## 📄 Licença

Este projeto é destinado a fins educacionais e de prototipação, podendo ser adaptado para uso corporativo conforme as políticas internas de empresas como ArcelorMittal ou CBMM.

---

## Wireframes da Interface

Os wireframes a seguir representam a estrutura visual do sistema:

1. **Tela Principal (Mural)** – Exibe KPIs, filtros e os compromissos em formato de cards.
2. **Modal de Cadastro/Edição** – Permite registrar e atualizar compromissos.
3. **Painel de Indicadores** – Mostra métricas de engajamento.
4. **Versão Mobile** – Interface responsiva para uso em tablets e smartphones industriais.

---

# 🖼️ Wireframes – Mural de Compromissos Sustentáveis

## 🎯 1. Visão Geral da Aplicação

```
+----------------------------------------------------------------------------------+
| LOGO DA EMPRESA                   MURAL DE COMPROMISSOS SUSTENTÁVEIS             |
|----------------------------------------------------------------------------------|
| "Engajando colaboradores rumo a um futuro sustentável"                           |
+----------------------------------------------------------------------------------+
| [ + Novo Compromisso ]        [ Buscar... ]      [Filtro: Setor ▼] [Categoria ▼] |
+----------------------------------------------------------------------------------+
| KPIs:                                                                            |
| [ Total ]        [ Concluídos ]        [ Em Andamento ]        [ Planejados ]    |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  +-------------------+  +-------------------+  +-------------------+             |
|  | Compromisso       |  | Compromisso       |  | Compromisso       |             |
|  |-------------------|  |-------------------|  |-------------------|             |
|  | Nome: João        |  | Nome: Maria       |  | Nome: Carlos      |             |
|  | Setor: Produção   |  | Setor: Logística  |  | Setor: Manutenção |             |
|  | Categoria: Amb.   |  | Categoria: Social |  | Categoria: Gov.   |             |
|  | Descrição...      |  | Descrição...      |  | Descrição...      |             |
|  | Data: 10/05/2026  |  | Data: 12/05/2026  |  | Data: 15/05/2026  |             |
|  | Status: ✔        |  | Status: ⏳         |  | Status: 📌        |             |
|  | [Editar] [Excluir]|  | [Editar] [Excluir]|  | [Editar] [Excluir]|             |
|  +-------------------+  +-------------------+  +-------------------+             |
|                                                                                  |
+----------------------------------------------------------------------------------+
| Rodapé: © 2026 - Programa de Sustentabilidade                                    |
+----------------------------------------------------------------------------------+
```

---

## 📝 2. Modal – Cadastro/Edição de Compromisso

```
+--------------------------------------------------------------+
|                 NOVO COMPROMISSO SUSTENTÁVEL                 |
|--------------------------------------------------------------|
| Nome do Colaborador:  [_______________________________]      |
| Setor/Departamento:   [_______________________________]      |
| Categoria ESG:        [Ambiental ▼]                          |
|                                                              |
| Descrição:                                                   |
| [__________________________________________________________] |
| [__________________________________________________________] |
|                                                              |
| Data Prevista:        [__/__/____]                           |
| Status:               [Planejado ▼]                          |
| Impacto Estimado:     [_______________________________]      |
|                                                              |
|                [ Cancelar ]   [ Salvar ]                     |
+--------------------------------------------------------------+
```

---

## 📊 3. Painel de Indicadores (KPIs)

```
+-----------------------------------------------------------------------+
|                               INDICADORES                             |
|-----------------------------------------------------------------------|
| +----------------+  +----------------+  +----------------+            |
| | Total          |  | Concluídos     |  | Em Andamento   |            |
| |      24        |  |      10        |  |       8        |            |
| +----------------+  +----------------+  +----------------+            |
|                                                                       |
| +----------------+                                                    |
| | Planejados     |                                                    |
| |       6        |                                                    |
| +----------------+                                                    |
+-----------------------------------------------------------------------+
```

---

## 🔍 4. Barra de Filtros e Busca

```
+----------------------------------------------------------------------------------+
| Buscar: [_________________________]                                              |
|                                                                                  |
| Setor:      [Todos ▼]                                                            |
| Categoria:  [Todas ▼]                                                            |
| Status:     [Todos ▼]                                                            |
|                                                                                  |
|                                   [ Limpar Filtros ]                             |
+----------------------------------------------------------------------------------+
```

---

## 📱 5. Wireframe – Versão Mobile

```
+----------------------------------+
| LOGO                             |
| Mural de Compromissos            |
+----------------------------------+
| [ + Novo Compromisso ]           |
+----------------------------------+
| [ Buscar... ]                    |
| [ Filtros ▼ ]                    |
+----------------------------------+
| KPIs (scroll horizontal)         |
| [Total] [Concluídos] [Em And.]   |
+----------------------------------+
| +------------------------------+ |
| | Nome: João                   | |
| | Setor: Produção              | |
| | Categoria: Ambiental         | |
| | Descrição resumida...        | |
| | Status: ✔ Concluído         | |
| | [Editar] [Excluir]           | |
| +------------------------------+ |
|                                  |
+----------------------------------+
```

---

## 🎨 6. Mapeamento de Componentes para Tailwind CSS

| Componente      | Classes Tailwind Sugeridas                                              |
| --------------- | ----------------------------------------------------------------------- |
| Header          | `bg-blue-900 text-white p-6 shadow-md`                                  |
| Botão principal | `bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg`   |
| Cards           | `bg-gray-800 text-white p-4 rounded-xl shadow-md`                       |
| KPIs            | `bg-gray-800 p-4 rounded-xl text-center`                                |
| Modal           | `fixed inset-0 flex items-center justify-center bg-black bg-opacity-50` |
| Inputs          | `w-full p-2 rounded-md bg-gray-700 border border-gray-600`              |

---

## 🧭 7. Fluxo de Navegação

```
[Home/Mural]
      |
      +--> [Novo Compromisso]
      |         |
      |         +--> [Salvar] --> Retorna ao Mural
      |
      +--> [Editar Compromisso]
      |         |
      |         +--> [Atualizar]
      |
      +--> [Excluir Compromisso]
                |
                +--> [Confirmação]
```

---

## 📦 8. Estrutura de Componentes

```plaintext
App
├── Header
├── KPISection
├── FilterBar
├── CommitmentGrid
│   └── CommitmentCard
├── CommitmentModal
└── Footer
```

---
