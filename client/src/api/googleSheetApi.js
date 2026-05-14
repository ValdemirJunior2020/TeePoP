// client/src/api/googleSheetApi.js
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

function ensureUrl() {
  if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL')) {
    throw new Error('Configure o VITE_GOOGLE_SCRIPT_URL no arquivo .env antes de usar o app.');
  }
}

async function readJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Resposta inválida do servidor: ${text.slice(0, 160)}`);
  }
}

export async function getAllData() {
  ensureUrl();
  const url = `${SCRIPT_URL}?action=getAllData&t=${Date.now()}`;
  const response = await fetch(url, { method: 'GET' });
  const result = await readJsonResponse(response);
  if (!result.success) throw new Error(result.error || 'Erro ao buscar dados.');
  return result.data;
}

export async function addRecord(action, payload) {
  ensureUrl();
  const form = new URLSearchParams();
  form.append('action', action);
  form.append('payload', JSON.stringify(payload));

  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: form,
  });
  const result = await readJsonResponse(response);
  if (!result.success) throw new Error(result.error || 'Erro ao salvar registro.');
  return result.data;
}

export async function updateRecord(sheetName, id, payload) {
  ensureUrl();
  const form = new URLSearchParams();
  form.append('action', 'updateRecord');
  form.append('sheetName', sheetName);
  form.append('id', id);
  form.append('payload', JSON.stringify(payload));

  const response = await fetch(SCRIPT_URL, { method: 'POST', body: form });
  const result = await readJsonResponse(response);
  if (!result.success) throw new Error(result.error || 'Erro ao atualizar registro.');
  return result.data;
}

export async function deleteRecord(sheetName, id, socio = '') {
  ensureUrl();
  const form = new URLSearchParams();
  form.append('action', 'deleteRecord');
  form.append('sheetName', sheetName);
  form.append('id', id);
  form.append('socio', socio);

  const response = await fetch(SCRIPT_URL, { method: 'POST', body: form });
  const result = await readJsonResponse(response);
  if (!result.success) throw new Error(result.error || 'Erro ao excluir registro.');
  return result.data;
}

export function hasGoogleScriptUrl() {
  return Boolean(SCRIPT_URL && !SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'));
}
