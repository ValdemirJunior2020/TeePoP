// client/src/utils/formatters.js
export function formatCurrency(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(number);
}

export function formatDate(value) {
  if (!value) return '-';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR');
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function monthKey(dateValue = new Date()) {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function normalizeText(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function toNumber(value) {
  if (typeof value === 'number') return value;
  const clean = String(value || '0').replace(/[^0-9,.-]/g, '').replace(',', '.');
  return Number(clean) || 0;
}
