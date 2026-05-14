// client/src/api/googleSheetApi.js

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export function hasGoogleScriptUrl() {
  return Boolean(SCRIPT_URL && SCRIPT_URL.trim() !== "");
}

function getScriptUrl() {
  if (!hasGoogleScriptUrl()) {
    throw new Error(
      "URL do Google Apps Script não configurada. Verifique o arquivo client/.env."
    );
  }

  return SCRIPT_URL;
}

async function requestGet(action) {
  const url = `${getScriptUrl()}?action=${encodeURIComponent(action)}&_=${Date.now()}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao conectar com o Google Sheets.");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Erro retornado pelo Google Apps Script.");
  }

  return result.data;
}

async function requestPost(action, payload = {}) {
  const response = await fetch(getScriptUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action,
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao salvar dados no Google Sheets.");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Erro retornado pelo Google Apps Script.");
  }

  return result.data;
}

export async function getAllData() {
  return requestGet("getAllData");
}

export async function addRecord(action, payload) {
  const actionMap = {
    investimentos: "addInvestimento",
    investimento: "addInvestimento",
    Investimentos: "addInvestimento",
    Investimento: "addInvestimento",

    despesas: "addDespesa",
    despesa: "addDespesa",
    Despesas: "addDespesa",
    Despesa: "addDespesa",

    vendas: "addVenda",
    venda: "addVenda",
    Vendas: "addVenda",
    Venda: "addVenda",

    atividades: "addAtividade",
    atividade: "addAtividade",
    Atividades: "addAtividade",
    Atividade: "addAtividade",

    oracoes: "addOracao",
    oracao: "addOracao",
    Oracoes: "addOracao",
    Oracao: "addOracao",
    Orações: "addOracao",
    oração: "addOracao",

    estoque: "addEstoque",
    Estoque: "addEstoque",
  };

  const scriptAction = actionMap[action];

  if (!scriptAction) {
    throw new Error(`Tipo de registro inválido: ${action}`);
  }

  return requestPost(scriptAction, {
    payload,
  });
}

export async function addVenda(payload) {
  return requestPost("addVenda", {
    payload,
  });
}

export async function addOracao(payload) {
  return requestPost("addOracao", {
    payload,
  });
}

export async function updateRecord(sheetName, id, payload) {
  return requestPost("updateRecord", {
    sheetName,
    id,
    payload,
  });
}

export async function deleteRecord(sheetName, id, socio = "") {
  return requestPost("deleteRecord", {
    sheetName,
    id,
    socio,
  });
}