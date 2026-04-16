// ── State ────────────────────────────────────────────────────────────────────

let currentEditId = null;

// ── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadAndRender();
  setupFormListeners();
  setupFilterListeners();
  setupModalListeners();
});

function loadAndRender() {
  const items = getAll();
  populateSetorFilter(items);
  renderKPIs(items);
  renderMural(applyFilters(items));
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function openModal(editId = null) {
  currentEditId = editId;
  const modal     = document.getElementById('modal');
  const title     = document.getElementById('modal-title');
  const saveBtn   = document.getElementById('btn-save');
  const form      = document.getElementById('commitment-form');

  form.reset();

  if (editId) {
    const item = getById(editId);
    if (!item) return;
    title.textContent      = 'Editar Compromisso';
    saveBtn.textContent    = 'Atualizar';
    form.nome.value        = item.nome;
    form.setor.value       = item.setor;
    form.categoria.value   = item.categoria;
    form.descricao.value   = item.descricao;
    form.dataPrevista.value= item.dataPrevista || '';
    form.status.value      = item.status;
    form.impacto.value     = item.impacto || '';
  } else {
    title.textContent   = 'Novo Compromisso Sustentável';
    saveBtn.textContent = 'Salvar';
  }

  modal.classList.remove('hidden');
  modal.querySelector('[tabindex]')?.focus();
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  currentEditId = null;
  ['input-nome', 'input-setor', 'input-categoria', 'input-descricao'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    el.classList.add('border-gray-600');
    const errorEl = document.getElementById(id + '-error');
    if (errorEl) errorEl.remove();
  });
}

function setupModalListeners() {
  document.getElementById('btn-new').addEventListener('click', () => openModal());
  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

// ── Form ──────────────────────────────────────────────────────────────────────

function setupFormListeners() {
  document.getElementById('commitment-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;

    const data = {
      nome:         form.nome.value.trim(),
      setor:        form.setor.value.trim(),
      categoria:    form.categoria.value,
      descricao:    form.descricao.value.trim(),
      dataPrevista: form.dataPrevista.value,
      status:       form.status.value,
      impacto:      form.impacto.value.trim(),
    };

    const requiredFields = [
      { field: 'input-nome',      value: data.nome,      label: 'Nome do Colaborador' },
      { field: 'input-setor',     value: data.setor,     label: 'Setor/Departamento' },
      { field: 'input-categoria', value: data.categoria, label: 'Categoria ESG' },
      { field: 'input-descricao', value: data.descricao, label: 'Descrição da Ação' },
    ];

    let firstInvalid = null;
    requiredFields.forEach(({ field, value, label }) => {
      const el = document.getElementById(field);
      const errorId = field + '-error';
      let errorEl = document.getElementById(errorId);

      if (!value) {
        el.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        el.classList.remove('border-gray-600', 'focus:ring-emerald-500', 'focus:border-emerald-500');
        if (!errorEl) {
          errorEl = document.createElement('p');
          errorEl.id = errorId;
          errorEl.className = 'text-red-400 text-xs mt-1';
          el.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = `${label} é obrigatório.`;
        if (!firstInvalid) firstInvalid = el;
      } else {
        el.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        el.classList.add('border-gray-600');
        if (errorEl) errorEl.remove();
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    if (currentEditId) {
      updateItem(currentEditId, data);
    } else {
      addItem(data);
    }

    closeModal();
    loadAndRender();
  });
}

// ── Edit / Delete ─────────────────────────────────────────────────────────────

function editItem(id) {
  openModal(id);
}

function confirmDelete(id) {
  const item = getById(id);
  if (!item) return;
  const ok = window.confirm(`Deseja excluir o compromisso de "${item.nome}"?\n\nEsta ação não pode ser desfeita.`);
  if (ok) {
    deleteItem(id);
    loadAndRender();
  }
}

// ── Filters ───────────────────────────────────────────────────────────────────

function setupFilterListeners() {
  ['filter-search', 'filter-setor', 'filter-categoria', 'filter-status'].forEach(id => {
    document.getElementById(id).addEventListener('input', applyAndRender);
  });

  document.getElementById('btn-clear-filters').addEventListener('click', () => {
    document.getElementById('filter-search').value   = '';
    document.getElementById('filter-setor').value    = '';
    document.getElementById('filter-categoria').value= '';
    document.getElementById('filter-status').value   = '';
    applyAndRender();
  });
}

function applyAndRender() {
  const items = getAll();
  populateSetorFilter(items);
  renderKPIs(items);
  renderMural(applyFilters(items));
}

function applyFilters(items) {
  const search    = document.getElementById('filter-search').value.trim().toLowerCase();
  const setor     = document.getElementById('filter-setor').value;
  const categoria = document.getElementById('filter-categoria').value;
  const status    = document.getElementById('filter-status').value;

  return items.filter(item => {
    if (setor     && item.setor     !== setor)     return false;
    if (categoria && item.categoria !== categoria) return false;
    if (status    && item.status    !== status)    return false;
    if (search) {
      const haystack = [item.nome, item.setor, item.descricao, item.impacto]
        .join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}
