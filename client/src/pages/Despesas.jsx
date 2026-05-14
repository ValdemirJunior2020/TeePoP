// client/src/pages/Despesas.jsx

import { useMemo, useState } from "react";
import FormCard from "../components/FormCard";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { SOCIOS } from "../utils/constants";
import { formatCurrency, formatDate } from "../utils/formatters";

const hoje = new Date().toISOString().slice(0, 10);

const categorias = [
  "Máquina",
  "Material DTF",
  "Camisetas",
  "Latas / Embalagem",
  "Adesivos / Rótulos",
  "Frete",
  "Marketing",
  "Software",
  "Outro",
];

function criarItem() {
  return {
    categoria: "Latas / Embalagem",
    descricao: "",
    valor: "",
    fornecedor: "",
    linkProduto: "",
  };
}

function normalizarValor(valor) {
  const numero = Number(String(valor || "0").replace(",", "."));
  return Number.isFinite(numero) ? Number(numero.toFixed(2)) : 0;
}

export default function Despesas({ records = [], onSave, onDelete }) {
  const [form, setForm] = useState({
    socio: "",
    data: hoje,
    observacao: "",
    comprovanteUrl: "",
  });

  const [itens, setItens] = useState([criarItem(), criarItem(), criarItem()]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const despesas = records || [];

  const totalItens = useMemo(() => {
    return itens.reduce((total, item) => total + normalizarValor(item.valor), 0);
  }, [itens]);

  const itensValidos = useMemo(() => {
    return itens.filter((item) => {
      return (
        item.descricao.trim() ||
        item.fornecedor.trim() ||
        item.linkProduto.trim() ||
        normalizarValor(item.valor) > 0
      );
    });
  }, [itens]);

  const totalDespesas = useMemo(() => {
    return despesas.reduce((total, item) => {
      return total + normalizarValor(item.valor);
    }, 0);
  }, [despesas]);

  const totalPorSocio = useMemo(() => {
    return SOCIOS.reduce((acc, socio) => {
      acc[socio] = despesas
        .filter((item) => item.socio === socio)
        .reduce((total, item) => total + normalizarValor(item.valor), 0);

      return acc;
    }, {});
  }, [despesas]);

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
      setErro("Selecione o sócio que comprou.");
      return;
    }

    if (!form.data) {
      setErro("Selecione a data da despesa.");
      return;
    }

    if (itensValidos.length === 0) {
      setErro("Adicione pelo menos uma despesa com descrição e valor.");
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
          categoria: item.categoria,
          descricao: item.descricao,
          valor: normalizarValor(item.valor),
          fornecedor: item.fornecedor,
          linkProduto: item.linkProduto,
          observacao: form.observacao,
          comprovanteUrl: form.comprovanteUrl,
          criadoEm: new Date().toISOString(),
        };

        await onSave("addDespesa", payload);
      }

      setSucesso(
        `${itensValidos.length} despesa(s) salva(s) com sucesso. Total: ${formatCurrency(
          totalItens
        )}`
      );

      setForm({
        socio: "",
        data: hoje,
        observacao: "",
        comprovanteUrl: "",
      });

      setItens([criarItem(), criarItem(), criarItem()]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErro(error.message || "Não foi possível salvar as despesas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(record) {
    if (!record?.id) return;

    try {
      setLoading(true);
      await onDelete("Despesas", record.id, record.socio || "");
      setSucesso("Despesa excluída com sucesso.");
    } catch (error) {
      setErro(error.message || "Não foi possível excluir a despesa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-pop">
        <div className="rainbow-line" />

        <div className="p-5 lg:p-8">
          <p className="badge-pop bg-pink-100 text-teepopPink">
            🛒 Compras e gastos da empresa
          </p>

          <h1 className="mt-4 text-4xl font-black text-teepopInk">
            Despesas TeePoP
          </h1>

          <p className="mt-3 max-w-3xl text-base font-semibold text-purple-600">
            Registre compras de latas, camisetas, material DTF, adesivos,
            frete, marketing, software e qualquer outro gasto da empresa.
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
        <div className="rounded-[2rem] bg-white p-5 shadow-pop">
          <p className="text-sm font-black uppercase text-red-500">
            Total de despesas
          </p>
          <p className="mt-2 text-3xl font-black text-teepopInk">
            {formatCurrency(totalDespesas)}
          </p>
        </div>

        {SOCIOS.map((socio) => (
          <div key={socio} className="rounded-[2rem] bg-white p-5 shadow-pop">
            <p className="text-sm font-black uppercase text-teepopPurple">
              {socio}
            </p>
            <p className="mt-2 text-2xl font-black text-teepopInk">
              {formatCurrency(totalPorSocio[socio] || 0)}
            </p>
          </div>
        ))}
      </section>

      <FormCard title="Adicionar despesas em lote" emoji="🧾">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="font-black text-teepopInk">Sócio que comprou</span>
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
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-pink-50 via-yellow-50 to-cyan-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black text-teepopInk">
                  Itens comprados
                </h2>
                <p className="text-sm font-bold text-purple-600">
                  Coloque cada gasto em uma linha. O total será calculado
                  automaticamente.
                </p>
              </div>

              <div className="rounded-3xl bg-white px-5 py-3 text-center shadow-sm">
                <p className="text-xs font-black uppercase text-teepopPurple">
                  Total das despesas
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
                  className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm lg:grid-cols-[180px_1fr_150px_1fr_1fr_auto]"
                >
                  <label className="grid gap-2">
                    <span className="font-black text-teepopInk">Categoria</span>
                    <select
                      value={item.categoria}
                      onChange={(e) =>
                        handleItemChange(index, "categoria", e.target.value)
                      }
                      className="input-pop"
                    >
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="font-black text-teepopInk">
                      O que foi comprado
                    </span>
                    <input
                      type="text"
                      value={item.descricao}
                      onChange={(e) =>
                        handleItemChange(index, "descricao", e.target.value)
                      }
                      className="input-pop"
                      placeholder="Ex: Latas easy-open 10oz"
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

                  <label className="grid gap-2">
                    <span className="font-black text-teepopInk">Onde comprou</span>
                    <input
                      type="text"
                      value={item.fornecedor}
                      onChange={(e) =>
                        handleItemChange(index, "fornecedor", e.target.value)
                      }
                      className="input-pop"
                      placeholder="Ex: Amazon, Alibaba, Walmart"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="font-black text-teepopInk">
                      Link do produto
                    </span>
                    <input
                      type="url"
                      value={item.linkProduto}
                      onChange={(e) =>
                        handleItemChange(index, "linkProduto", e.target.value)
                      }
                      className="input-pop"
                      placeholder="https://..."
                    />
                  </label>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removerLinha(index)}
                      className="w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 hover:bg-red-100 lg:w-auto"
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
              ➕ Adicionar mais uma despesa
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
              placeholder="Ex: Compra feita para produção inicial da TeePoP."
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-pop bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 text-white disabled:opacity-60"
          >
            {loading
              ? "Salvando despesas..."
              : `Salvar ${itensValidos.length || ""} despesa(s) - Total ${formatCurrency(
                  totalItens
                )}`}
          </button>
        </form>
      </FormCard>

      <section className="rounded-[2rem] bg-white p-5 shadow-pop">
        <h2 className="text-2xl font-black text-teepopInk">
          Histórico de despesas
        </h2>

        <p className="mt-1 font-bold text-purple-500">
          Cada item comprado aparece separado aqui para todos os sócios
          acompanharem.
        </p>

        {loading ? (
          <LoadingSpinner />
        ) : despesas.length === 0 ? (
          <EmptyState texto="Nenhuma despesa registrada ainda." />
        ) : (
          <DataTable
            data={despesas}
            columns={[
              {
                key: "data",
                label: "Data",
                render: (item) => formatDate(item.data),
              },
              { key: "socio", label: "Sócio" },
              { key: "categoria", label: "Categoria" },
              { key: "descricao", label: "Descrição" },
              {
                key: "valor",
                label: "Valor",
                render: (item) => formatCurrency(item.valor),
              },
              { key: "fornecedor", label: "Onde comprou" },
              {
                key: "linkProduto",
                label: "Produto",
                render: (item) =>
                  item.linkProduto ? (
                    <a
                      href={item.linkProduto}
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
              { key: "observacao", label: "Observação" },
            ]}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}