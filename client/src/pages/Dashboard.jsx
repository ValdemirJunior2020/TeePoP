// client/src/pages/Dashboard.jsx
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { calculateSummary, latest } from '../utils/calculations';
import { formatCurrency, formatDate } from '../utils/formatters';
import { SOCIOS } from '../utils/constants';

export default function Dashboard({ data, setActivePage }) {
  const summary = calculateSummary(data);
  const ultimasAtividades = latest(data.atividades, 4);
  const ultimasVendas = latest(data.vendas, 4);
  const ultimasDespesas = latest(data.despesas, 4);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-pop">
        <div className="rainbow-line" />
        <div className="grid gap-5 p-5 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
          <div>
            <p className="badge-pop bg-pink-100 text-teepopPink">🌈 Gestão transparente para sócios</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-teepopInk sm:text-5xl">Painel Geral TeePoP</h1>
            <p className="mt-3 max-w-2xl text-base font-semibold text-purple-600">Controle de caixa, investimentos, vendas, despesas, atividades do dia, estoque e compromisso de oração em um só lugar.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => setActivePage('vendas')} className="btn-pop bg-teepopPink text-white">Registrar venda</button>
              <button onClick={() => setActivePage('investimentos')} className="btn-pop bg-teepopYellow text-teepopInk">Adicionar investimento</button>
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-pink-100 via-yellow-100 to-cyan-100 p-5">
            <p className="text-sm font-black uppercase tracking-wide text-teepopPurple">Oração de hoje</p>
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-black text-emerald-600">Já registraram:</p>
                <p className="font-bold text-teepopInk">{summary.quemOrouHoje.length ? summary.quemOrouHoje.join(', ') : 'Ninguém ainda'}</p>
              </div>
              <div>
                <p className="font-black text-pink-600">Ainda falta registrar:</p>
                <p className="font-bold text-teepopInk">{summary.quemFaltaOrarHoje.length ? summary.quemFaltaOrarHoje.join(', ') : 'Todos registraram 🙏'}</p>
              </div>
              <p className="rounded-2xl bg-white/80 p-3 text-sm font-black text-teepopPurple">Orações registradas no mês: {summary.totalOracoesMes}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Saldo atual" value={formatCurrency(summary.saldoAtual)} icon="🏦" gradient="from-emerald-400 to-cyan-400" />
        <StatCard title="Total investido" value={formatCurrency(summary.totalInvestimentos)} icon="💰" gradient="from-yellow-300 to-pink-400" />
        <StatCard title="Vendas pagas" value={formatCurrency(summary.totalVendasPagas)} icon="🧾" gradient="from-cyan-400 to-blue-500" />
        <StatCard title="Despesas" value={formatCurrency(summary.totalDespesas)} icon="🛒" gradient="from-pink-400 to-red-500" />
        <StatCard title="Lucro/prejuízo" value={formatCurrency(summary.lucroEstimado)} icon="📈" gradient="from-purple-500 to-pink-500" />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <PartnerCard title="Investido por sócio" values={summary.investidoPorSocio} money />
        <RecentCard title="Últimas vendas" items={ultimasVendas} empty="Nenhuma venda registrada." render={(item) => `${item.cliente || 'Cliente'} • ${formatCurrency(item.valorTotal)} • ${item.status}`} />
        <RecentCard title="Últimas despesas" items={ultimasDespesas} empty="Nenhuma despesa registrada." render={(item) => `${item.categoria || 'Categoria'} • ${formatCurrency(item.valor)} • ${item.socio || '-'}`} />
      </section>

      <section className="rounded-[2rem] bg-white/90 p-5 shadow-pop">
        <h2 className="text-2xl font-black text-teepopInk">Últimas atividades do dia</h2>
        {ultimasAtividades.length === 0 ? <EmptyState texto="Quando um sócio registrar uma atividade, ela aparecerá aqui." /> : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ultimasAtividades.map((item) => (
              <div key={item.id} className="rounded-3xl bg-purple-50 p-4">
                <p className="text-xs font-black uppercase text-teepopPink">{item.socio} • {formatDate(item.data)}</p>
                <h3 className="mt-1 text-lg font-black text-teepopInk">{item.tipoAtividade || 'Atividade'}</h3>
                <p className="mt-1 text-sm font-semibold text-purple-700">{item.atividade}</p>
                {item.proximoPasso ? <p className="mt-2 rounded-2xl bg-white p-2 text-sm font-bold text-teepopPurple">Próximo: {item.proximoPasso}</p> : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PartnerCard({ title, values, money = false }) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-pop">
      <h3 className="text-xl font-black text-teepopInk">{title}</h3>
      <div className="mt-4 space-y-3">
        {SOCIOS.map((socio) => (
          <div key={socio} className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-pink-50 to-cyan-50 px-4 py-3">
            <span className="font-black text-teepopInk">{socio}</span>
            <span className="font-black text-teepopPurple">{money ? formatCurrency(values[socio] || 0) : values[socio] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentCard({ title, items, render, empty }) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-pop">
      <h3 className="text-xl font-black text-teepopInk">{title}</h3>
      {items.length === 0 ? <p className="mt-4 rounded-2xl bg-teepopCream p-4 font-bold text-purple-500">{empty}</p> : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-teepopCream p-3">
              <p className="font-black text-teepopInk">{render(item)}</p>
              <p className="text-xs font-bold text-purple-500">{formatDate(item.data)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
