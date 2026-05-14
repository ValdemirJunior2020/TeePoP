// client/src/utils/calculations.js
import { SOCIOS } from './constants';
import { monthKey, todayISO, toNumber } from './formatters';

export function calculateSummary(data) {
  const investimentos = data.investimentos || [];
  const despesas = data.despesas || [];
  const vendas = data.vendas || [];
  const atividades = data.atividades || [];
  const oracoes = data.oracoes || [];

  const totalInvestimentos = investimentos.reduce((sum, item) => sum + toNumber(item.valor), 0);
  const totalDespesas = despesas.reduce((sum, item) => sum + toNumber(item.valor), 0);
  const vendasPagas = vendas.filter((item) => item.status === 'Pago');
  const vendasPendentes = vendas.filter((item) => item.status === 'Pendente');
  const totalVendasPagas = vendasPagas.reduce((sum, item) => sum + toNumber(item.valorTotal), 0);
  const totalVendasPendentes = vendasPendentes.reduce((sum, item) => sum + toNumber(item.valorTotal), 0);
  const saldoAtual = totalInvestimentos + totalVendasPagas - totalDespesas;
  const lucroEstimado = totalVendasPagas - totalDespesas;

  const investidoPorSocio = groupMoney(investimentos, 'socio', 'valor');
  const vendasPorSocio = groupMoney(vendasPagas, 'socio', 'valorTotal');
  const atividadesPorSocio = groupCount(atividades, 'socio');
  const oracoesPorSocio = groupCount(oracoes.filter((o) => o.orou === 'Sim'), 'socio');
  const despesasPorCategoria = groupMoney(despesas, 'categoria', 'valor');

  const hoje = todayISO();
  const oracoesHoje = oracoes.filter((item) => String(item.data).slice(0, 10) === hoje && item.orou === 'Sim');
  const quemOrouHoje = [...new Set(oracoesHoje.map((item) => item.socio).filter(Boolean))];
  const quemFaltaOrarHoje = SOCIOS.filter((socio) => !quemOrouHoje.includes(socio));
  const mesAtual = monthKey();
  const totalOracoesMes = oracoes.filter((item) => monthKey(`${String(item.data).slice(0, 10)}T12:00:00`) === mesAtual && item.orou === 'Sim').length;

  return {
    totalInvestimentos,
    totalDespesas,
    totalVendasPagas,
    totalVendasPendentes,
    saldoAtual,
    lucroEstimado,
    investidoPorSocio,
    vendasPorSocio,
    atividadesPorSocio,
    oracoesPorSocio,
    despesasPorCategoria,
    quemOrouHoje,
    quemFaltaOrarHoje,
    totalOracoesMes,
  };
}

export function groupMoney(items, key, valueKey) {
  return items.reduce((acc, item) => {
    const label = item[key] || 'Sem informação';
    acc[label] = (acc[label] || 0) + toNumber(item[valueKey]);
    return acc;
  }, {});
}

export function groupCount(items, key) {
  return items.reduce((acc, item) => {
    const label = item[key] || 'Sem informação';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
}

export function latest(items, count = 5) {
  return [...(items || [])]
    .sort((a, b) => new Date(b.criadoEm || b.atualizadoEm || b.data || 0) - new Date(a.criadoEm || a.atualizadoEm || a.data || 0))
    .slice(0, count);
}

export function makeCashFlow(data) {
  const map = {};
  (data.investimentos || []).forEach((i) => addFlow(map, i.data, toNumber(i.valor)));
  (data.vendas || []).filter((v) => v.status === 'Pago').forEach((v) => addFlow(map, v.data, toNumber(v.valorTotal)));
  (data.despesas || []).forEach((d) => addFlow(map, d.data, -toNumber(d.valor)));
  let running = 0;
  return Object.keys(map).sort().map((date) => {
    running += map[date];
    return { data: date.slice(5), fluxo: map[date], saldo: running };
  });
}

function addFlow(map, date, value) {
  const key = String(date || '').slice(0, 10) || todayISO();
  map[key] = (map[key] || 0) + value;
}
