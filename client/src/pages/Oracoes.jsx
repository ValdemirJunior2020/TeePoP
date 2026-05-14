// client/src/pages/Oracoes.jsx

import { useMemo, useState } from "react";
import FormCard from "../components/FormCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { SOCIOS } from "../utils/constants";
import { formatDate } from "../utils/formatters";

const hoje = new Date().toISOString().slice(0, 10);

const mensagensProfeticas = [
  {
    titulo: "Deus está abrindo portas para a TeePoP",
    texto:
      "Que o Senhor abençoe cada plano, cada venda, cada produto e cada decisão desta empresa. Que a TeePoP cresça com sabedoria, união, excelência e propósito.",
    versiculo:
      "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos. — Provérbios 16:3",
    emoji: "🌈🙏",
  },
  {
    titulo: "A provisão de Deus está sobre este negócio",
    texto:
      "Que nada falte, que cada sócio caminhe em unidade, e que a TeePoP seja uma fonte de criatividade, alegria, prosperidade e testemunho.",
    versiculo:
      "O Senhor te abrirá o seu bom tesouro, o céu, para dar chuva à tua terra no seu tempo e para abençoar toda obra das tuas mãos. — Deuteronômio 28:12",
    emoji: "✨💛",
  },
  {
    titulo: "A TeePoP está debaixo de direção e propósito",
    texto:
      "Que cada detalhe seja guiado por Deus: compras, vendas, clientes, ideias, embalagens, camisas e decisões. Que venha crescimento com paz.",
    versiculo:
      "O Senhor firmará os passos daquele cujo caminho lhe agrada. — Salmos 37:23",
    emoji: "🕊️🎁",
  },
  {
    titulo: "Deus honra a fidelidade e a união",
    texto:
      "Que esta oração suba como semente. Que Deus fortaleça os sócios, traga clientes certos, oportunidades certas e livramento de decisões erradas.",
    versiculo:
      "Oh! Quão bom e quão suave é que os irmãos vivam em união. — Salmos 133:1",
    emoji: "🤝🔥",
  },
];

function gerarMensagemProfetica() {
  const index = Math.floor(Math.random() * mensagensProfeticas.length);
  return mensagensProfeticas[index];
}

function sameDate(a, b) {
  return String(a || "").slice(0, 10) === String(b || "").slice(0, 10);
}

export default function Oracoes({ records = [], onSave, onDelete }) {
  const [form, setForm] = useState({
    socio: "",
    data: hoje,
    orou: "Sim",
    pedidoOracao: "",
    versiculo: "",
    observacao: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [mensagemProfetica, setMensagemProfetica] = useState(null);
  const [filtroSocio, setFiltroSocio] = useState("Todos");
  const [filtroData, setFiltroData] = useState("");

  const oracoes = records || [];

  const oracoesHoje = useMemo(() => {
    return oracoes.filter((item) => sameDate(item.data, hoje));
  }, [oracoes]);

  const sociosQueOraramHoje = useMemo(() => {
    return oracoesHoje
      .filter((item) => item.orou === "Sim")
      .map((item) => item.socio);
  }, [oracoesHoje]);

  const sociosFaltando = useMemo(() => {
    return SOCIOS.filter((socio) => !sociosQueOraramHoje.includes(socio));
  }, [sociosQueOraramHoje]);

  const oracoesFiltradas = useMemo(() => {
    return oracoes
      .filter((item) => {
        const socioOk = filtroSocio === "Todos" || item.socio === filtroSocio;
        const dataOk = !filtroData || sameDate(item.data, filtroData);
        return socioOk && dataOk;
      })
      .sort((a, b) => {
        const dataA = new Date(a.criadoEm || a.data || 0).getTime();
        const dataB = new Date(b.criadoEm || b.data || 0).getTime();
        return dataB - dataA;
      });
  }, [oracoes, filtroSocio, filtroData]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setSucesso("");
    setMensagemProfetica(null);

    if (!form.socio) {
      setErro("Selecione o sócio antes de salvar a oração.");
      return;
    }

    if (!form.data) {
      setErro("Selecione a data da oração.");
      return;
    }

    const jaRegistrouNaData = oracoes.find(
      (item) => item.socio === form.socio && sameDate(item.data, form.data)
    );

    if (jaRegistrouNaData) {
      const continuar = window.confirm(
        `${form.socio} já registrou oração nesta data.\n\nDeseja continuar e registrar novamente?`
      );

      if (!continuar) {
        setErro("Oração duplicada não foi salva.");
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        criadoEm: new Date().toISOString(),
      };

      await onSave("oracoes", payload);

      setSucesso(`Oração registrada com sucesso por ${form.socio}.`);
      setMensagemProfetica(gerarMensagemProfetica());

      setFiltroSocio("Todos");
      setFiltroData("");

      setForm({
        socio: "",
        data: hoje,
        orou: "Sim",
        pedidoOracao: "",
        versiculo: "",
        observacao: "",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErro(error.message || "Não foi possível registrar a oração.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(record) {
    if (!record?.id) return;

    try {
      setLoading(true);
      await onDelete("Oracoes", record.id, record.socio || "");
      setSucesso("Oração apagada com sucesso.");
      setMensagemProfetica(null);
    } catch (error) {
      setErro(error.message || "Não foi possível apagar a oração.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-pop">
        <div className="rainbow-line" />

        <div className="p-5 lg:p-8">
          <p className="badge-pop bg-purple-100 text-teepopPurple">
            🙏 Compromisso espiritual
          </p>

          <h1 className="mt-4 text-4xl font-black text-teepopInk">
            Oração pela Empresa
          </h1>

          <p className="mt-3 max-w-3xl text-base font-semibold text-purple-600">
            Registre quem orou pela TeePoP hoje, pedidos de oração, palavras
            recebidas e observações importantes para manter a empresa debaixo de
            propósito, união e direção.
          </p>
        </div>
      </section>

      {mensagemProfetica ? (
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 via-purple-500 to-sky-500 p-[3px] shadow-pop">
          <div className="rounded-[1.8rem] bg-white/95 p-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-pink-300 to-sky-300 text-4xl shadow-lg">
              {mensagemProfetica.emoji}
            </div>

            <p className="text-sm font-black uppercase tracking-widest text-teepopPink">
              Mensagem profética TeePoP
            </p>

            <h2 className="mt-2 text-3xl font-black text-teepopInk">
              {mensagemProfetica.titulo}
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-lg font-bold leading-relaxed text-purple-700">
              {mensagemProfetica.texto}
            </p>

            <div className="mx-auto mt-5 max-w-3xl rounded-3xl bg-gradient-to-r from-yellow-50 via-pink-50 to-cyan-50 p-5">
              <p className="text-base font-black italic text-teepopPurple">
                “{mensagemProfetica.versiculo}”
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {sucesso ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 font-black text-emerald-700">
          ✅ {sucesso}
        </div>
      ) : null}

      {erro ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 font-black text-red-700">
          ⚠️ {erro}
        </div>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-5 shadow-pop">
          <h2 className="text-xl font-black text-teepopInk">
            Quem já orou hoje
          </h2>

          {sociosQueOraramHoje.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-pink-50 p-4 font-bold text-purple-500">
              Ninguém registrou oração ainda.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {sociosQueOraramHoje.map((socio) => (
                <div
                  key={socio}
                  className="rounded-2xl bg-emerald-50 px-4 py-3 font-black text-emerald-700"
                >
                  ✅ {socio}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-pop">
          <h2 className="text-xl font-black text-teepopInk">
            Ainda falta registrar
          </h2>

          {sociosFaltando.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-cyan-50 p-4 font-bold text-cyan-700">
              Todos registraram hoje 🙏
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {sociosFaltando.map((socio) => (
                <div
                  key={socio}
                  className="rounded-2xl bg-yellow-50 px-4 py-3 font-black text-yellow-700"
                >
                  ⏳ {socio}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-pop">
          <h2 className="text-xl font-black text-teepopInk">
            Total de orações
          </h2>

          <div className="mt-4 rounded-3xl bg-gradient-to-br from-pink-100 via-yellow-100 to-cyan-100 p-5 text-center">
            <p className="text-5xl font-black text-teepopPurple">
              {oracoes.length}
            </p>
            <p className="mt-2 font-black text-teepopInk">
              registros de oração
            </p>
          </div>
        </div>
      </section>

      <FormCard title="Registrar oração" emoji="🙏">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="font-black text-teepopInk">Sócio</span>
              <select
                name="socio"
                value={form.socio}
                onChange={handleChange}
                className="input-pop"
                required
              >
                <option value="">Selecione</option>
                {SOCIOS.map((socio) => (
                  <option key={socio} value={socio}>
                    {socio}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="font-black text-teepopInk">Data</span>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                className="input-pop"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="font-black text-teepopInk">
                Orou pela empresa hoje?
              </span>
              <select
                name="orou"
                value={form.orou}
                onChange={handleChange}
                className="input-pop"
              >
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="font-black text-teepopInk">Pedido de oração</span>
            <textarea
              name="pedidoOracao"
              value={form.pedidoOracao}
              onChange={handleChange}
              className="input-pop min-h-[100px]"
              placeholder="Ex: Que Deus abra portas, traga clientes certos e fortaleça a união dos sócios."
            />
          </label>

          <label className="grid gap-2">
            <span className="font-black text-teepopInk">
              Palavra ou versículo
            </span>
            <input
              type="text"
              name="versiculo"
              value={form.versiculo}
              onChange={handleChange}
              className="input-pop"
              placeholder="Ex: Provérbios 16:3"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-black text-teepopInk">Observação</span>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              className="input-pop min-h-[90px]"
              placeholder="Escreva algo que Deus colocou no coração, uma direção ou uma observação."
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-pop bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 text-white disabled:opacity-60"
          >
            {loading ? "Salvando oração..." : "Salvar oração e receber mensagem"}
          </button>
        </form>
      </FormCard>

      <section className="rounded-[2rem] bg-white p-5 shadow-pop">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-teepopInk">
              Mural de Orações
            </h2>
            <p className="mt-1 font-bold text-purple-500">
              Aqui todos os sócios podem ler as orações registradas.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={filtroSocio}
              onChange={(e) => setFiltroSocio(e.target.value)}
              className="input-pop"
            >
              <option value="Todos">Todos os sócios</option>
              {SOCIOS.map((socio) => (
                <option key={socio} value={socio}>
                  {socio}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="input-pop"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : oracoesFiltradas.length === 0 ? (
          <EmptyState texto="Nenhuma oração encontrada. Limpe os filtros ou registre uma oração." />
        ) : (
          <div className="mt-6 grid gap-5">
            {oracoesFiltradas.map((oracao) => (
              <article
                key={oracao.id}
                className="overflow-hidden rounded-[2rem] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-cyan-50 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="badge-pop bg-white text-teepopPurple">
                      🙏 {oracao.socio || "Sócio"}
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-teepopInk">
                      Oração registrada em {formatDate(oracao.data)}
                    </h3>

                    <p className="mt-1 text-sm font-black text-emerald-600">
                      Orou pela empresa? {oracao.orou || "Sim"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(oracao)}
                    className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-black text-red-600 hover:bg-red-100"
                  >
                    Excluir
                  </button>
                </div>

                {oracao.pedidoOracao ? (
                  <div className="mt-5 rounded-3xl bg-white/90 p-4">
                    <p className="text-sm font-black uppercase text-teepopPink">
                      Pedido de oração
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-base font-semibold leading-relaxed text-purple-800">
                      {oracao.pedidoOracao}
                    </p>
                  </div>
                ) : null}

                {oracao.versiculo ? (
                  <div className="mt-4 rounded-3xl bg-yellow-50 p-4">
                    <p className="text-sm font-black uppercase text-yellow-700">
                      Palavra / Versículo
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-base font-black italic text-teepopInk">
                      “{oracao.versiculo}”
                    </p>
                  </div>
                ) : null}

                {oracao.observacao ? (
                  <div className="mt-4 rounded-3xl bg-cyan-50 p-4">
                    <p className="text-sm font-black uppercase text-cyan-700">
                      Observação
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-base font-semibold leading-relaxed text-slate-700">
                      {oracao.observacao}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}