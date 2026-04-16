const STORAGE_KEY = "mural_compromissos_sustentaveis";

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getAll() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveAll(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function addItem(item) {
  const items = getAll();
  item.id = generateId();
  item.dataCriacao = new Date().toISOString();
  items.push(item);
  saveAll(items);
  return item;
}

function updateItem(id, updated) {
  const items = getAll();
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updated };
    saveAll(items);
    return items[index];
  }
  return null;
}

function deleteItem(id) {
  saveAll(getAll().filter(i => i.id !== id));
}

function getById(id) {
  return getAll().find(i => i.id === id) || null;
}
