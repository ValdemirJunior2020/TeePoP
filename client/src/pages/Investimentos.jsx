// client/src/pages/Investimentos.jsx

import { useMemo, useState } from "react";
import FormCard from "../components/FormCard";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { SOCIOS } from "../utils/constants";
import { formatCurrency, formatDate } from "../utils/formatters";

const hoje = new Date().toISOString().slice(0, 10);

const formasPagamento = [
  "Cash",
  "Zelle",
  "Cash App",
  "Venmo",
  "Cartão",
  "Banco",
  "Outro",
];

function criarItem() {
  return {
    descricao: "",
    valor: "",
  };
}

function normalizarValor(valor) {
  const numero = Number(String(valor || "0").replace(",", "."));
  return Number.isFinite(numero) ? Number(numero.toFixed(2)) : 0;
}

export default function Investimentos({ records = [], onSave, onDelete }) {
  const [form, setForm] = useState({
    socio: "",
    data: hoje,
    formaPagamento: "Cash",
    observacao: "",
    comprovanteUrl: "",
  });

  const [itens, setItens] = useState([criarItem(), criarItem(), criarItem()]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const investimentos = records || [];

  const totalItens = useMemo(() => {
    return itens.reduce((total, item) => {
      return total + normalizarValor(item.valor);
    }, 0);
  }, [itens]);

  const itensValidos = useMemo(() => {
    return itens.filter((item) => {
      return item.descricao.trim() || normalizarValor(item.valor) > 0;
    });
  }, [itens]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleItemChange(index, field, value) {
    setItens((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function adicionarLinha() {
    setItens((prev) => [...prev, criarItem()]);
  }

  function removerLinha(index) {
    if (itens.length <= 3) {
      setErro("Mantenha pelo menos 3 linhas para lançamento.");
      return;
    }

    setItens((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!form.socio) {
      setErro("Selecione o sócio antes de salvar.");
      return;
    }

    if (!form.data) {
      setErro("Selecione a data.");
      return;
    }

    if (itensValidos.length === 0) {
      setErro("Adicione pelo menos um valor com descrição.");
      return;
    }

    const itemInvalido = itensValidos.find(
      (item) => !item.descricao.trim() || normalizarValor(item.valor) <= 0
    );

    if (itemInvalido) {
      setErro("Cada linha preenchida precisa ter descrição e valor maior que zero.");
      return;
    }

    try {
      setLoading(true);

      for (const item of itensValidos) {
        const payload = {
          socio: form.socio,
          data: form.data,
          valor: normalizarValor(item.valor),
          formaPagamento: form.formaPagamento,
          observacao: form.observacao
            ? `${item.descricao} | Observação geral: ${form.observacao}`
            : item.descricao,
          comprovanteUrl: form.comprovanteUrl,
          criadoEm: new Date().toISOString(),
        };

        await onSave("addInvestimento", payload);
      }

      setSucesso(
        `${itensValidos.length} investimento(s) salvo(s) com sucesso. Total: ${formatCurrency(
          totalItens
        )}`
      );

      setForm({
        socio: "",
        data: hoje,
        formaPagamento: "Cash",
        observacao: "",
        comprovanteUrl: "",
      });

      setItens([criarItem(), criarItem(), criarItem()]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErro(error.message || "Não foi possível salvar os investimentos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(record) {
    if (!record?.id) return;

    try {
      setLoading(true);
      await onDelete("Investimentos", record.id, record.socio || "");
      setSucesso("Investimento excluído com sucesso.");
    } catch (error) {
      setErro(error.message || "Não foi possível excluir o investimento.");
    } finally {
      setLoading(false);
    }
  }

  const totalInvestido = investimentos.reduce((total, item) => {
    return total + normalizarValor(item.valor);
  }, 0);

  const totalPorSocio = SOCIOS.reduce((acc, socio) => {
    acc[socio] = investimentos
      .filter((item) => item.socio === socio)
      .reduce((total, item) => total + normalizarValor(item.valor), 0);

    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-pop">
        <div className="rainbow-line" />

        <div className="p-5 lg:p-8">
          <p className="badge-pop bg-yellow-100 text-yellow-700">
            💰 Capital dos sócios
          </p>

          <h1 className="mt-4 text-4xl font-black text-teepopInk">
            Investimentos TeePoP
          </h1>

          <p className="mt-3 max-w-3xl text-base font-semibold text-purple-600">
            Registre quanto cada sócio colocou na empresa. Você pode adicionar
            vários valores de uma só vez, informar no que foi usado e ver o
            total calculado antes de salvar.
          </p>
        </div>
      </section>

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

      <section className="grid gap-5 md:grid-cols-4">
        <div className="rounded-[2rem] bg-white p-5 shadow-pop md:col-span-1">
          <p className="text-sm font-black uppercase text-teepopPurple">
            Total investido
          </p>
          <p className="mt-2 text-3xl font-black text-teepopInk">
            {formatCurrency(totalInvestido)}
          </p>
        </div>

        {SOCIOS.map((socio) => (
          <div key={socio} className="rounded-[2rem] bg-white p-5 shadow-pop">
            <p className="text-sm font-black uppercase text-teepopPink">
              {socio}
            </p>
            <p className="mt-2 text-2xl font-black text-teepopInk">
              {formatCurrency(totalPorSocio[socio] || 0)}
            </p>
          </div>
        ))}
      </section>

      <FormCard title="Adicionar investimentos em lote" emoji="💸">
        <form onSubmit={handleSubmit} className="grid gap-5">
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
                Forma de pagamento
              </span>
              <select
                name="formaPagamento"
                value={form.formaPagamento}
                onChange={handleChange}
                className="input-pop"
              >
                {formasPagamento.map((forma) => (
                  <option key={forma} value={forma}>
                    {forma}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-pink-50 via-yellow-50 to-cyan-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black text-teepopInk">
                  Valores adicionados
                </h2>
                <p className="text-sm font-bold text-purple-600">
                  Preencha no que foi usado e o valor. Pode adicionar mais
                  linhas se precisar.
                </p>
              </div>

              <div className="rounded-3xl bg-white px-5 py-3 text-center shadow-sm">
                <p className="text-xs font-black uppercase text-teepopPurple">
                  Total calculado
                </p>
                <p className="text-2xl font-black text-teepopInk">
                  {formatCurrency(totalItens)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {itens.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_auto]"
                >
                  <label className="grid gap-2">
                    <span className="font-black text-teepopInk">
                      No que foi usado #{index + 1}
                    </span>
                    <input
                      type="text"
                      value={item.descricao}
                      onChange={(e) =>
                        handleItemChange(index, "descricao", e.target.value)
                      }
                      className="input-pop"
                      placeholder="Ex: Amazon - latas e camisetas"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="font-black text-teepopInk">Valor</span>
                    <input
                      type="number"
                      value={item.valor}
                      onChange={(e) =>
                        handleItemChange(index, "valor", e.target.value)
                      }
                      className="input-pop"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </label>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removerLinha(index)}
                      className="w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 hover:bg-red-100 md:w-auto"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={adicionarLinha}
              className="mt-4 rounded-2xl bg-white px-5 py-3 font-black text-teepopPurple shadow-sm hover:bg-purple-50"
            >
              ➕ Adicionar mais uma linha
            </button>
          </div>

          <label className="grid gap-2">
            <span className="font-black text-teepopInk">
              Comprovante URL opcional
            </span>
            <input
              type="url"
              name="comprovanteUrl"
              value={form.comprovanteUrl}
              onChange={handleChange}
              className="input-pop"
              placeholder="Cole aqui o link do comprovante, se tiver"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-black text-teepopInk">Observação geral</span>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              className="input-pop min-h-[100px]"
              placeholder="Ex: Compra feita para iniciar estoque da TeePoP."
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-pop bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 text-white disabled:opacity-60"
          >
            {loading
              ? "Salvando investimentos..."
              : `Salvar ${itensValidos.length || ""} investimento(s) - Total ${formatCurrency(
                  totalItens
                )}`}
          </button>
        </form>
      </FormCard>

      <section className="rounded-[2rem] bg-white p-5 shadow-pop">
        <h2 className="text-2xl font-black text-teepopInk">
          Histórico de investimentos
        </h2>

        <p className="mt-1 font-bold text-purple-500">
          Cada item lançado em lote aparece separado aqui para facilitar a
          conferência dos sócios.
        </p>

        {loading ? (
          <LoadingSpinner />
        ) : investimentos.length === 0 ? (
          <EmptyState texto="Nenhum investimento registrado ainda." />
        ) : (
          <DataTable
            data={investimentos}
            columns={[
              {
                key: "data",
                label: "Data",
                render: (item) => formatDate(item.data),
              },
              { key: "socio", label: "Sócio" },
              {
                key: "valor",
                label: "Valor",
                render: (item) => formatCurrency(item.valor),
              },
              { key: "formaPagamento", label: "Pagamento" },
              { key: "observacao", label: "No que foi / Observação" },
              {
                key: "comprovanteUrl",
                label: "Comprovante",
                render: (item) =>
                  item.comprovanteUrl ? (
                    <a
                      href={item.comprovanteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-black text-teepopPurple underline"
                    >
                      Abrir
                    </a>
                  ) : (
                    "-"
                  ),
              },
            ]}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}