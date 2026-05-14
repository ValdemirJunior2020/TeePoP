// client/src/pages/Dashboard.jsx

import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import MusicPlayer from "../components/MusicPlayer";
import { calculateSummary, latest } from "../utils/calculations";
import { formatCurrency, formatDate } from "../utils/formatters";
import { SOCIOS } from "../utils/constants";

function getHoje() {
  return new Date().toISOString().slice(0, 10);
}

function sameDate(a, b) {
  return String(a || "").slice(0, 10) === String(b || "").slice(0, 10);
}

function getTimeValue(item) {
  return new Date(item.criadoEm || item.data || 0).getTime();
}

export default function Dashboard({ data, setActivePage }) {
  const summary = calculateSummary(data);

  const ultimasVendas = latest(data.vendas, 4);
  const ultimasDespesas = latest(data.despesas, 4);

  const hoje = getHoje();

  const atividadesHoje = (data.atividades || [])
    .filter((item) => sameDate(item.data, hoje))
    .map((item) => ({
      ...item,
      tipoRegistro: "atividade",
    }));

  const oracoesHoje = (data.oracoes || [])
    .filter((item) => sameDate(item.data, hoje))
    .map((item) => ({
      ...item,
      tipoRegistro: "oracao",
    }));

  const movimentosHoje = [...atividadesHoje, ...oracoesHoje].sort(
    (a, b) => getTimeValue(b) - getTimeValue(a)
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-pop">
        <div className="rainbow-line" />

        <div className="grid gap-5 p-5 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
          <div>
            <p className="badge-pop bg-pink-100 text-teepopPink">
              🌈 Gestão transparente para sócios
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight text-teepopInk sm:text-5xl">
              Painel Geral TeePoP
            </h1>

            <p className="mt-3 max-w-2xl text-base font-semibold text-purple-600">
              Controle de caixa, investimentos, vendas, despesas, atividades do
              dia, estoque e compromisso de oração em um só lugar.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => setActivePage("vendas")}
                className="btn-pop bg-teepopPink text-white"
              >
                Registrar venda
              </button>

              <button
                onClick={() => setActivePage("despesas")}
                className="btn-pop bg-teepopYellow text-teepopInk"
              >
                Registrar despesa
              </button>

              <button
                onClick={() => setActivePage("oracoes")}
                className="btn-pop bg-purple-500 text-white"
              >
                Registrar oração
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-pink-100 via-yellow-100 to-cyan-100 p-5">
            <p className="text-sm font-black uppercase tracking-wide text-teepopPurple">
              Oração de hoje
            </p>

            <div className="mt-3 space-y-3">
              <div>
                <p className="font-black text-emerald-600">Já registraram:</p>
                <p className="font-bold text-teepopInk">
                  {summary.quemOrouHoje.length
                    ? summary.quemOrouHoje.join(", ")
                    : "Ninguém ainda"}
                </p>
              </div>

              <div>
                <p className="font-black text-pink-600">
                  Ainda falta registrar:
                </p>
                <p className="font-bold text-teepopInk">
                  {summary.quemFaltaOrarHoje.length
                    ? summary.quemFaltaOrarHoje.join(", ")
                    : "Todos registraram 🙏"}
                </p>
              </div>

              <p className="rounded-2xl bg-white/80 p-3 text-sm font-black text-teepopPurple">
                Orações registradas no mês: {summary.totalOracoesMes}
              </p>
            </div>
          </div>
        </div>
      </section>

      <MusicPlayer />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Saldo atual"
          value={formatCurrency(summary.saldoAtual)}
          icon="🏦"
          gradient="from-emerald-400 to-cyan-400"
        />

        <StatCard
          title="Total investido"
          value={formatCurrency(summary.totalInvestimentos)}
          icon="💰"
          gradient="from-yellow-300 to-pink-400"
        />

        <StatCard
          title="Vendas pagas"
          value={formatCurrency(summary.totalVendasPagas)}
          icon="🧾"
          gradient="from-cyan-400 to-blue-500"
        />

        <StatCard
          title="Despesas"
          value={formatCurrency(summary.totalDespesas)}
          icon="🛒"
          gradient="from-pink-400 to-red-500"
        />

        <StatCard
          title="Lucro/prejuízo"
          value={formatCurrency(summary.lucroEstimado)}
          icon="📈"
          gradient="from-purple-500 to-pink-500"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <PartnerCard
          title="Investido por sócio"
          values={summary.investidoPorSocio}
          money
        />

        <RecentCard
          title="Últimas vendas"
          items={ultimasVendas}
          empty="Nenhuma venda registrada."
          render={(item) =>
            `${item.cliente || "Cliente"} • ${formatCurrency(
              item.valorTotal
            )} • ${item.status || "-"}`
          }
        />

        <RecentCard
          title="Últimas despesas"
          items={ultimasDespesas}
          empty="Nenhuma despesa registrada."
          render={(item) =>
            `${item.categoria || "Categoria"} • ${formatCurrency(
              item.valor
            )} • ${item.socio || "-"}`
          }
        />
      </section>

      <section className="rounded-[2rem] bg-white/90 p-5 shadow-pop">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-teepopInk">
              Orações e atividades de hoje
            </h2>
            <p className="mt-1 font-bold text-purple-500">
              Aqui aparecem as orações registradas hoje e também o que cada
              sócio fez no dia.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActivePage("oracoes")}
              className="rounded-2xl bg-purple-100 px-4 py-2 text-sm font-black text-purple-700 hover:bg-purple-200"
            >
              🙏 Registrar oração
            </button>

            <button
              onClick={() => setActivePage("atividades")}
              className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700 hover:bg-emerald-200"
            >
              ✅ Registrar atividade
            </button>
          </div>
        </div>

        {movimentosHoje.length === 0 ? (
          <EmptyState texto="Quando um sócio registrar uma oração ou atividade hoje, aparecerá aqui." />
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {movimentosHoje.map((item) => {
              if (item.tipoRegistro === "oracao") {
                return (
                  <div
                    key={`oracao-${item.id}`}
                    className="rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-5 shadow-sm"
                  >
                    <p className="badge-pop bg-white text-teepopPurple">
                      🙏 Oração registrada
                    </p>

                    <h3 className="mt-3 text-xl font-black text-teepopInk">
                      {item.socio} orou pela TeePoP
                    </h3>

                    <p className="mt-1 text-sm font-black text-emerald-600">
                      Data: {formatDate(item.data)}
                    </p>

                    {item.pedidoOracao ? (
                      <div className="mt-4 rounded-3xl bg-white/90 p-4">
                        <p className="text-xs font-black uppercase text-teepopPink">
                          Pedido de oração
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-relaxed text-purple-800">
                          {item.pedidoOracao}
                        </p>
                      </div>
                    ) : null}

                    {item.versiculo ? (
                      <div className="mt-4 rounded-3xl bg-yellow-50 p-4">
                        <p className="text-xs font-black uppercase text-yellow-700">
                          Versículo
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm font-black italic text-teepopInk">
                          “{item.versiculo}”
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <div
                  key={`atividade-${item.id}`}
                  className="rounded-3xl bg-purple-50 p-5 shadow-sm"
                >
                  <p className="badge-pop bg-white text-teepopPink">
                    ✅ Atividade do dia
                  </p>

                  <p className="mt-3 text-xs font-black uppercase text-teepopPink">
                    {item.socio} • {formatDate(item.data)}
                  </p>

                  <h3 className="mt-1 text-xl font-black text-teepopInk">
                    {item.tipoAtividade || "Atividade"}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-purple-700">
                    {item.atividade}
                  </p>

                  {item.resultado ? (
                    <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold text-emerald-700">
                      Resultado: {item.resultado}
                    </p>
                  ) : null}

                  {item.proximoPasso ? (
                    <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold text-teepopPurple">
                      Próximo: {item.proximoPasso}
                    </p>
                  ) : null}
                </div>
              );
            })}
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
          <div
            key={socio}
            className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-pink-50 to-cyan-50 px-4 py-3"
          >
            <span className="font-black text-teepopInk">{socio}</span>

            <span className="font-black text-teepopPurple">
              {money
                ? formatCurrency(values?.[socio] || 0)
                : values?.[socio] || 0}
            </span>
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

      {items.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-teepopCream p-4 font-bold text-purple-500">
          {empty}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-teepopCream p-3">
              <p className="font-black text-teepopInk">{render(item)}</p>
              <p className="text-xs font-bold text-purple-500">
                {formatDate(item.data)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}