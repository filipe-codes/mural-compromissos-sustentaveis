// ── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function getCategoryBadge(categoria) {
  const map = {
    'Ambiental':  'bg-emerald-600 text-white',
    'Social':     'bg-blue-500 text-white',
    'Governança': 'bg-purple-500 text-white',
  };
  return map[categoria] || 'bg-gray-600 text-white';
}

function getStatusBadge(status) {
  const map = {
    'Concluído':    'bg-green-900/50 text-green-400 border border-green-700',
    'Em andamento': 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
    'Planejado':    'bg-blue-900/50 text-blue-400 border border-blue-700',
  };
  return map[status] || 'bg-gray-700 text-gray-400';
}

function getStatusIcon(status) {
  const map = {
    'Concluído':    '✔',
    'Em andamento': '⏳',
    'Planejado':    '📌',
  };
  return map[status] || '';
}

// ── Toast ───────────────────────────────────────────────────────────────────

function showToast(message, type = 'error') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const colors = type === 'error'
    ? 'bg-red-900 border-red-700 text-red-100'
    : 'bg-emerald-900 border-emerald-700 text-emerald-100';

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl border shadow-lg text-sm font-medium ${colors} transition-opacity duration-300 whitespace-nowrap`;
  toast.setAttribute('role', 'alert');
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Card ────────────────────────────────────────────────────────────────────

function createCard(item) {
  const card = document.createElement('div');
  card.className = [
    'bg-gray-800 text-gray-100 p-5 rounded-xl shadow-md',
    'flex flex-col gap-3 border border-gray-700',
    'hover:border-emerald-700 transition-all duration-200',
  ].join(' ');
  card.dataset.id = item.id;

  card.innerHTML = `
    <div class="flex justify-between items-start gap-2">
      <div class="min-w-0">
        <h3 class="font-bold text-base leading-tight truncate">${escapeHtml(item.nome)}</h3>
        <p class="text-gray-400 text-sm mt-0.5">${escapeHtml(item.setor)}</p>
      </div>
      <span class="${getCategoryBadge(item.categoria)} text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap shrink-0">
        ${escapeHtml(item.categoria)}
      </span>
    </div>

    <p class="text-gray-300 text-sm leading-relaxed flex-1">${escapeHtml(item.descricao)}</p>

    ${item.impacto ? `<p class="text-gray-400 text-xs italic border-l-2 border-emerald-700 pl-2">Impacto: ${escapeHtml(item.impacto)}</p>` : ''}

    <div class="flex items-center justify-between mt-auto pt-2">
      <span class="text-gray-400 text-xs">📅 ${formatDate(item.dataPrevista)}</span>
      <span class="${getStatusBadge(item.status)} text-xs font-medium px-2.5 py-1 rounded-full">
        ${getStatusIcon(item.status)} ${escapeHtml(item.status)}
      </span>
    </div>

    <div class="flex gap-2 pt-3 border-t border-gray-700">
      <button
        onclick="editItem('${item.id}')"
        class="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-sm py-1.5 px-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Editar compromisso de ${escapeHtml(item.nome)}"
      >Editar</button>
      <button
        onclick="confirmDelete('${item.id}')"
        class="flex-1 bg-red-800 hover:bg-red-700 text-white text-sm py-1.5 px-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Excluir compromisso de ${escapeHtml(item.nome)}"
      >Excluir</button>
    </div>
  `;
  return card;
}

// ── Mural ───────────────────────────────────────────────────────────────────

function renderMural(items) {
  const mural = document.getElementById('mural-section');
  mural.innerHTML = '';

  if (items.length === 0) {
    mural.innerHTML = `
      <div class="col-span-full text-center py-20 text-gray-500">
        <p class="text-5xl mb-4">🌱</p>
        <p class="text-xl font-medium text-gray-400">Nenhum compromisso encontrado.</p>
        <p class="text-sm mt-2">Clique em <span class="text-emerald-500 font-medium">+ Novo Compromisso</span> para começar!</p>
      </div>`;
    return;
  }

  items.forEach(item => mural.appendChild(createCard(item)));
}

// ── KPIs ────────────────────────────────────────────────────────────────────

function renderKPIs(items) {
  const total      = items.length;
  const concluidos = items.filter(i => i.status === 'Concluído').length;
  const andamento  = items.filter(i => i.status === 'Em andamento').length;
  const planejados = items.filter(i => i.status === 'Planejado').length;
  const pct        = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  const ambiental  = items.filter(i => i.categoria === 'Ambiental').length;
  const social     = items.filter(i => i.categoria === 'Social').length;
  const governanca = items.filter(i => i.categoria === 'Governança').length;

  setText('kpi-total',      total);
  setText('kpi-concluidos', concluidos);
  setText('kpi-andamento',  andamento);
  setText('kpi-planejados', planejados);
  setText('kpi-percentual', pct + '%');
  setText('kpi-ambiental',  ambiental);
  setText('kpi-social',     social);
  setText('kpi-governanca', governanca);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ── Setor filter options ─────────────────────────────────────────────────────

function populateSetorFilter(items) {
  const select = document.getElementById('filter-setor');
  const current = select.value;
  const setores = [...new Set(items.map(i => i.setor).filter(Boolean))].sort();

  select.innerHTML = '<option value="">Todos os Setores</option>';
  setores.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });
  select.value = current;
}
