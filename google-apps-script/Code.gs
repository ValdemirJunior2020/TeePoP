// google-apps-script/Code.gs
const SPREADSHEET_ID = '1djpWTCxnKuITwonDaFdvVDL1GCrAMHBym9QvHRWsZH0';

const SHEETS = {
  Config: ['chave', 'valor'],
  Socios: ['id', 'nome', 'ativo', 'criadoEm'],
  Investimentos: ['id', 'data', 'socio', 'valor', 'formaPagamento', 'observacao', 'comprovanteUrl', 'criadoEm'],
  Despesas: ['id', 'data', 'socio', 'categoria', 'descricao', 'valor', 'fornecedor', 'linkProduto', 'observacao', 'comprovanteUrl', 'criadoEm'],
  Vendas: ['id', 'data', 'cliente', 'produto', 'quantidade', 'valorTotal', 'formaPagamento', 'socio', 'status', 'observacao', 'criadoEm'],
  Atividades: ['id', 'data', 'socio', 'atividade', 'tempoDedicado', 'tipoAtividade', 'resultado', 'proximoPasso', 'criadoEm'],
  Oracoes: ['id', 'data', 'socio', 'orou', 'pedidoOracao', 'versiculo', 'observacao', 'criadoEm'],
  Estoque: ['id', 'produto', 'categoria', 'quantidadeAtual', 'unidade', 'quantidadeMinima', 'observacao', 'atualizadoEm'],
  Logs: ['id', 'dataHora', 'acao', 'modulo', 'socio', 'detalhes'],
};

const DEFAULT_SOCIOS = ['Pastora Priscila', 'Vinicios', 'Junior'];

function doGet(e) {
  try {
    ensureSetup();
    const action = String((e && e.parameter && e.parameter.action) || 'getAllData');

    if (action === 'setup') return jsonResponse({ success: true, data: ensureSetup(), message: 'Abas configuradas com sucesso.' });
    if (action === 'getAllData') return jsonResponse({ success: true, data: getAllData() });
    if (action === 'getInvestimentos') return jsonResponse({ success: true, data: getRows('Investimentos') });
    if (action === 'getDespesas') return jsonResponse({ success: true, data: getRows('Despesas') });
    if (action === 'getVendas') return jsonResponse({ success: true, data: getRows('Vendas') });
    if (action === 'getAtividades') return jsonResponse({ success: true, data: getRows('Atividades') });
    if (action === 'getOracoes') return jsonResponse({ success: true, data: getRows('Oracoes') });
    if (action === 'getEstoque') return jsonResponse({ success: true, data: getRows('Estoque') });
    if (action === 'getSocios') return jsonResponse({ success: true, data: getRows('Socios') });

    return jsonResponse({ success: false, error: 'Ação GET inválida: ' + action });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || String(error) });
  }
}

function doPost(e) {
  try {
    ensureSetup();
    const params = parseRequest(e);
    const action = params.action;
    const payload = params.payload || {};

    const actionMap = {
      addInvestimento: 'Investimentos',
      addDespesa: 'Despesas',
      addVenda: 'Vendas',
      addAtividade: 'Atividades',
      addOracao: 'Oracoes',
      addEstoque: 'Estoque',
    };

    if (actionMap[action]) {
      const sheetName = actionMap[action];
      const record = addRecord(sheetName, payload);
      logAction('ADD', sheetName, record.socio || payload.socio || '', JSON.stringify(record));
      return jsonResponse({ success: true, data: record });
    }

    if (action === 'updateRecord') {
      const sheetName = params.sheetName;
      const id = params.id;
      const record = updateRecord(sheetName, id, payload);
      logAction('UPDATE', sheetName, record.socio || payload.socio || '', JSON.stringify(record));
      return jsonResponse({ success: true, data: record });
    }

    if (action === 'deleteRecord') {
      const sheetName = params.sheetName;
      const id = params.id;
      const deleted = deleteRecord(sheetName, id);
      logAction('DELETE', sheetName, params.socio || '', 'ID excluído: ' + id);
      return jsonResponse({ success: true, data: deleted });
    }

    return jsonResponse({ success: false, error: 'Ação POST inválida: ' + action });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message || String(error) });
  }
}

function doOptions() {
  return jsonResponse({ success: true });
}

function parseRequest(e) {
  const result = {};
  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(function (key) {
      result[key] = e.parameter[key];
    });
  }

  if (result.payload && typeof result.payload === 'string') {
    result.payload = JSON.parse(result.payload);
  }

  if ((!result.action || !result.payload) && e && e.postData && e.postData.contents) {
    const contents = e.postData.contents;
    try {
      const parsed = JSON.parse(contents);
      Object.keys(parsed).forEach(function (key) { result[key] = parsed[key]; });
    } catch (err) {
      // Form posts already arrive in e.parameter. Nothing else needed.
    }
  }

  return result;
}

function ensureSetup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(SHEETS).forEach(function (sheetName) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);
    const headers = SHEETS[sheetName];
    const existing = sheet.getRange(1, 1, 1, Math.max(headers.length, sheet.getLastColumn() || 1)).getValues()[0];
    let needsHeader = false;
    headers.forEach(function (header, index) {
      if (existing[index] !== header) needsHeader = true;
    });
    if (needsHeader) {
      sheet.clear();
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#ff4fb8').setFontColor('#ffffff');
      sheet.autoResizeColumns(1, headers.length);
    }
  });

  const socios = getRows('Socios');
  if (socios.length === 0) {
    DEFAULT_SOCIOS.forEach(function (nome) {
      addRecord('Socios', { nome: nome, ativo: 'Sim' }, false);
    });
  }

  const config = getRows('Config');
  if (config.length === 0) {
    appendRow('Config', { chave: 'appName', valor: 'TeePoP Caixa & Gestão' });
    appendRow('Config', { chave: 'versao', valor: '1.0.0' });
  }

  return { sheets: Object.keys(SHEETS), socios: DEFAULT_SOCIOS };
}

function getAllData() {
  return {
    config: getRows('Config'),
    socios: getRows('Socios'),
    investimentos: getRows('Investimentos'),
    despesas: getRows('Despesas'),
    vendas: getRows('Vendas'),
    atividades: getRows('Atividades'),
    oracoes: getRows('Oracoes'),
    estoque: getRows('Estoque'),
    logs: getRows('Logs'),
  };
}

function getRows(sheetName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).filter(function (row) {
    return row.some(function (cell) { return cell !== '' && cell !== null; });
  }).map(function (row) {
    const record = {};
    headers.forEach(function (header, index) {
      record[header] = normalizeCell(row[index]);
    });
    return record;
  });
}

function addRecord(sheetName, payload, shouldLog) {
  validateSheet(sheetName);
  const record = Object.assign({}, payload || {});
  record.id = record.id || Utilities.getUuid();
  const now = new Date().toISOString();
  if (sheetName === 'Estoque') record.atualizadoEm = now;
  else if (sheetName !== 'Socios' && sheetName !== 'Config') record.criadoEm = record.criadoEm || now;
  if (sheetName === 'Socios') record.criadoEm = record.criadoEm || now;
  appendRow(sheetName, record);
  if (shouldLog !== false) logAction('ADD', sheetName, record.socio || record.nome || '', JSON.stringify(record));
  return record;
}

function appendRow(sheetName, record) {
  const sheet = getSheet(sheetName);
  const headers = SHEETS[sheetName];
  const row = headers.map(function (header) {
    return record[header] !== undefined ? record[header] : '';
  });
  sheet.appendRow(row);
  return record;
}

function updateRecord(sheetName, id, payload) {
  validateSheet(sheetName);
  if (!id) throw new Error('ID obrigatório para atualizar.');
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) throw new Error('Aba sem coluna id: ' + sheetName);

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      const current = {};
      headers.forEach(function (header, index) { current[header] = normalizeCell(values[i][index]); });
      const updated = Object.assign({}, current, payload || {}, { id: id });
      if (sheetName === 'Estoque') updated.atualizadoEm = new Date().toISOString();
      const row = headers.map(function (header) { return updated[header] !== undefined ? updated[header] : ''; });
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([row]);
      return updated;
    }
  }
  throw new Error('Registro não encontrado para atualizar: ' + id);
}

function deleteRecord(sheetName, id) {
  validateSheet(sheetName);
  if (!id) throw new Error('ID obrigatório para excluir.');
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { id: id, deleted: true };
    }
  }
  throw new Error('Registro não encontrado para excluir: ' + id);
}

function logAction(acao, modulo, socio, detalhes) {
  try {
    appendRow('Logs', {
      id: Utilities.getUuid(),
      dataHora: new Date().toISOString(),
      acao: acao,
      modulo: modulo,
      socio: socio || '',
      detalhes: detalhes || '',
    });
  } catch (err) {
    // Evita quebrar a operação principal se o log falhar.
  }
}

function getSheet(sheetName) {
  validateSheet(sheetName);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  if (!sheet) throw new Error('Aba não encontrada: ' + sheetName);
  return sheet;
}

function validateSheet(sheetName) {
  if (!SHEETS[sheetName]) throw new Error('Aba inválida: ' + sheetName);
}

function normalizeCell(value) {
  if (value instanceof Date) return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return value;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
