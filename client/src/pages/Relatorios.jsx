// client/src/pages/Relatorios.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import StatCard from '../components/StatCard';
import { calculateSummary, makeCashFlow } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#ff4fb8', '#ffd84d', '#35d6ff', '#6b38ff', '#22c55e', '#fb7185', '#f97316'];

export default function Relatorios({ data }) {
  const summary = calculateSummary(data);
  const investimento = objectToChart(summary.investidoPorSocio, 'socio', 'valor');
  const despesas = objectToChart(summary.despesasPorCategoria, 'categoria', 'valor');
  const vendas = objectToChart(summary.vendasPorSocio, 'socio', 'valor');
  const atividades = objectToChart(summary.atividadesPorSocio, 'socio', 'total');
  const oracoes = objectToChart(summary.oracoesPorSocio, 'socio', 'total');
  const fluxo = makeCashFlow(data);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-pop">
        <p className="badge-pop bg-pink-100 text-teepopPink">📊 Relatórios TeePoP</p>
        <h1 className="mt-3 text-4xl font-black text-teepopInk">Relatórios e visão dos sócios</h1>
        <p className="mt-2 font-semibold text-purple-600">Resumo financeiro, participação por sócio, despesas, vendas e oração.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Saldo atual" value={formatCurrency(summary.saldoAtual)} icon="🏦" gradient="from-emerald-400 to-cyan-400" />
        <StatCard title="Vendas pendentes" value={formatCurrency(summary.totalVendasPendentes)} icon="⏳" gradient="from-yellow-300 to-orange-400" />
        <StatCard title="Total despesas" value={formatCurrency(summary.totalDespesas)} icon="🛒" gradient="from-pink-400 to-red-500" />
        <StatCard title="Orações do mês" value={summary.totalOracoesMes} icon="🙏" gradient="from-purple-500 to-pink-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Investimento por sócio">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={investimento}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="socio" /><YAxis /><Tooltip formatter={(v) => formatCurrency(v)} /><Bar dataKey="valor" radius={[16, 16, 0, 0]} fill="#ff4fb8" /></BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Despesas por categoria">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={despesas} dataKey="valor" nameKey="categoria" outerRadius={105} label>{despesas.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => formatCurrency(v)} /></PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fluxo de caixa ao longo do tempo">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fluxo}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="data" /><YAxis /><Tooltip formatter={(v) => formatCurrency(v)} /><Line type="monotone" dataKey="saldo" stroke="#6b38ff" strokeWidth={4} dot={{ r: 5 }} /></LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vendas pagas por sócio">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendas}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="socio" /><YAxis /><Tooltip formatter={(v) => formatCurrency(v)} /><Bar dataKey="valor" radius={[16, 16, 0, 0]} fill="#35d6ff" /></BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <Ranking title="Atividades por sócio" data={atividades} labelKey="socio" valueKey="total" />
        <Ranking title="Orações por sócio" data={oracoes} labelKey="socio" valueKey="total" />
      </section>
    </div>
  );
}

function objectToChart(obj, labelKey, valueKey) {
  return Object.entries(obj || {}).map(([key, value]) => ({ [labelKey]: key, [valueKey]: value }));
}

function ChartCard({ title, children }) {
  return <div className="rounded-[2rem] bg-white p-5 shadow-pop"><h2 className="mb-4 text-2xl font-black text-teepopInk">{title}</h2>{children}</div>;
}

function Ranking({ title, data, labelKey, valueKey }) {
  const sorted = [...data].sort((a, b) => b[valueKey] - a[valueKey]);
  return <div className="rounded-[2rem] bg-white p-5 shadow-pop"><h2 className="text-2xl font-black text-teepopInk">{title}</h2><div className="mt-4 space-y-3">{sorted.length ? sorted.map((item, index) => <div key={item[labelKey]} className="flex justify-between rounded-2xl bg-teepopCream px-4 py-3"><span className="font-black text-teepopInk">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'} {item[labelKey]}</span><span className="font-black text-teepopPurple">{item[valueKey]}</span></div>) : <p className="font-bold text-purple-500">Sem dados ainda.</p>}</div></div>;
}
