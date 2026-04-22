
let currentEditId = null;


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


function openModal(editId = null) {
  currentEditId = editId;
  const modal     = document.querySelector('#modal');
  const title     = document.querySelector('#modal-title');
  const saveBtn   = document.querySelector('#btn-save');
  const form      = document.querySelector('#commitment-form');

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
  document.querySelector('#modal').classList.add('hidden');
  currentEditId = null;
  ['input-nome', 'input-setor', 'input-categoria', 'input-descricao'].forEach(id => {
    const el = document.querySelector(`#${id}`);
    el.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    el.classList.add('border-gray-600');
    document.querySelector(`#${id}-error`)?.remove();
  });

  const dateEl = document.querySelector('#input-data');
  dateEl.classList.remove('border-yellow-500');
  dateEl.classList.add('border-gray-600');
  document.querySelector('#input-data-warn')?.remove();
}

function setupModalListeners() {
  document.querySelector('#btn-new').addEventListener('click', () => openModal());
  document.querySelector('#btn-cancel').addEventListener('click', closeModal);
  document.querySelector('#modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}


function setupFormListeners() {
  document.querySelector('#commitment-form').addEventListener('submit', e => {
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
      const el = document.querySelector(`#${field}`);
      const errorId = `${field}-error`;
      let errorEl = document.querySelector(`#${errorId}`);

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

    if (data.dataPrevista) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosen = new Date(data.dataPrevista + 'T00:00:00');
      if (chosen < today && data.status !== 'Concluído') {
        const dateEl = document.querySelector('#input-data');
        dateEl.classList.add('border-yellow-500');
        dateEl.classList.remove('border-gray-600');
        let warn = document.querySelector('#input-data-warn');
        if (!warn) {
          warn = document.createElement('p');
          warn.id = 'input-data-warn';
          warn.className = 'text-yellow-400 text-xs mt-1';
          dateEl.parentElement.appendChild(warn);
        }
        warn.textContent = 'A data prevista já passou.';
      } else {
        const dateEl = document.querySelector('#input-data');
        dateEl.classList.remove('border-yellow-500');
        dateEl.classList.add('border-gray-600');
        document.querySelector('#input-data-warn')?.remove();
      }
    }

    try {
      if (currentEditId) {
        updateItem(currentEditId, data);
      } else {
        addItem(data);
      }
      closeModal();
      loadAndRender();
    } catch (e) {
      showToast(e.message);
    }
  });
}


function editItem(id) {
  openModal(id);
}

function confirmDelete(id) {
  const item = getById(id);
  if (!item) return;

  const modal   = document.querySelector('#confirm-modal');
  const message = document.querySelector('#confirm-message');
  const btnOk   = document.querySelector('#confirm-ok');
  const btnCancel = document.querySelector('#confirm-cancel');

  message.textContent = `Deseja excluir o compromisso de "${item.nome}"?`;
  modal.classList.remove('hidden');
  btnCancel.focus();

  function close() {
    modal.classList.add('hidden');
    btnOk.removeEventListener('click', onOk);
    btnCancel.removeEventListener('click', close);
    modal.removeEventListener('click', onBackdrop);
    document.removeEventListener('keydown', onKey);
  }

  function onOk() {
    close();
    deleteItem(id);
    loadAndRender();
  }

  function onBackdrop(e) {
    if (e.target === modal) close();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  btnOk.addEventListener('click', onOk);
  btnCancel.addEventListener('click', close);
  modal.addEventListener('click', onBackdrop);
  document.addEventListener('keydown', onKey);
}


function setupFilterListeners() {
  ['filter-search', 'filter-setor', 'filter-categoria', 'filter-status'].forEach(id => {
    document.querySelector(`#${id}`).addEventListener('input', applyAndRender);
  });

  document.querySelector('#btn-clear-filters').addEventListener('click', () => {
    document.querySelector('#filter-search').value   = '';
    document.querySelector('#filter-setor').value    = '';
    document.querySelector('#filter-categoria').value= '';
    document.querySelector('#filter-status').value   = '';
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
  const search    = document.querySelector('#filter-search').value.trim().toLowerCase();
  const setor     = document.querySelector('#filter-setor').value;
  const categoria = document.querySelector('#filter-categoria').value;
  const status    = document.querySelector('#filter-status').value;

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
