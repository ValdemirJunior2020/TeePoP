// client/src/pages/Vendas.jsx

import { useState } from "react";
import FormCard from "../components/FormCard";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { addVenda, deleteRecord } from "../api/googleSheetApi";
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

const statusVenda = ["Pago", "Pendente", "Cancelado"];

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizarValor(valor) {
  const numero = Number(String(valor || "0").replace(",", "."));
  return Number.isFinite(numero) ? Number(numero.toFixed(2)) : 0;
}

export default function Vendas({ data, refreshData }) {
  const [form, setForm] = useState({
    data: hoje,
    cliente: "",
    produto: "",
    quantidade: 1,
    valorTotal: "",
    formaPagamento: "Cash",
    socio: "",
    status: "Pago",
    observacao: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const vendas = data?.vendas || [];

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function vendaJaExiste() {
    const clienteNovo = normalizarTexto(form.cliente);
    const produtoNovo = normalizarTexto(form.produto);
    const valorNovo = normalizarValor(form.valorTotal);
    const dataNova = form.data;

    return vendas.find((venda) => {
      const clienteExistente = normalizarTexto(venda.cliente);
      const produtoExistente = normalizarTexto(venda.produto);
      const valorExistente = normalizarValor(venda.valorTotal);
      const dataExistente = venda.data;

      return (
        clienteExistente === clienteNovo &&
        produtoExistente === produtoNovo &&
        valorExistente === valorNovo &&
        dataExistente === dataNova
      );
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!form.data) {
      setErro("Selecione a data da venda.");
      return;
    }

    if (!form.cliente.trim()) {
      setErro("Digite o nome do cliente.");
      return;
    }

    if (!form.produto.trim()) {
      setErro("Digite o produto vendido.");
      return;
    }

    if (!form.socio) {
      setErro("Selecione quem vendeu.");
      return;
    }

    if (normalizarValor(form.valorTotal) <= 0) {
      setErro("Digite um valor total maior que zero.");
      return;
    }

    const vendaDuplicada = vendaJaExiste();

    if (vendaDuplicada) {
      const continuar = window.confirm(
        `⚠️ Essa venda já foi registrada com esse valor.\n\n` +
          `Cliente: ${vendaDuplicada.cliente}\n` +
          `Produto: ${vendaDuplicada.produto}\n` +
          `Valor: ${formatCurrency(vendaDuplicada.valorTotal)}\n` +
          `Data: ${formatDate(vendaDuplicada.data)}\n\n` +
          `Deseja continuar mesmo assim?`
      );

      if (!continuar) {
        setErro("Venda duplicada não foi salva.");
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        quantidade: Number(form.quantidade || 1),
        valorTotal: normalizarValor(form.valorTotal),
        criadoEm: new Date().toISOString(),
      };

      const response = await addVenda(payload);

      if (!response?.success) {
        throw new Error(response?.error || "Erro ao salvar venda.");
      }

      setSucesso("Venda registrada com sucesso.");

      setForm({
        data: hoje,
        cliente: "",
        produto: "",
        quantidade: 1,
        valorTotal: "",
        formaPagamento: "Cash",
        socio: "",
        status: "Pago",
        observacao: "",
      });

      if (refreshData) {
        await refreshData();
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErro(error.message || "Não foi possível registrar a venda.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(record) {
    const confirmar = window.confirm("Tem certeza que deseja apagar esta venda?");

    if (!confirmar) return;

    try {
      setLoading(true);

      const response = await deleteRecord({
        tab: "Vendas",
        id: record.id,
      });

      if (!response?.success) {
        throw new Error(response?.error || "Erro ao apagar venda.");
      }

      setSucesso("Venda apagada com sucesso.");

      if (refreshData) {
        await refreshData();
      }
    } catch (error) {
      setErro(error.message || "Não foi possível apagar a venda.");
    } finally {
      setLoading(false);
    }
  }

  const vendasPagas = vendas.filter((venda) => venda.status === "Pago");
  const vendasPendentes = vendas.filter((venda) => venda.status === "Pendente");

  const totalPago = vendasPagas.reduce(
    (total, venda) => total + normalizarValor(venda.valorTotal),
    0
  );

  const totalPendente = vendasPendentes.reduce(
    (total, venda) => total + normalizarValor(venda.valorTotal),
    0
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-pop">
        <div className="rainbow-line" />

        <div className="p-5 lg:p-8">
          <p className="badge-pop bg-pink-100 text-teepopPink">
            🧾 Controle de vendas
          </p>

          <h1 className="mt-4 text-4xl font-black text-teepopInk">
            Vendas TeePoP
          </h1>

          <p className="mt-3 max-w-3xl text-base font-semibold text-purple-600">
            Registre as vendas da TeePoP, acompanhe valores pagos, pendentes e
            mantenha todos os sócios alinhados.
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

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-5 shadow-pop">
          <p className="text-sm font-black uppercase text-emerald-600">
            Vendas pagas
          </p>
          <p className="mt-2 text-3xl font-black text-teepopInk">
            {formatCurrency(totalPago)}
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-pop">
          <p className="text-sm font-black uppercase text-yellow-600">
            Vendas pendentes
          </p>
          <p className="mt-2 text-3xl font-black text-teepopInk">
            {formatCurrency(totalPendente)}
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-pop">
          <p className="text-sm font-black uppercase text-purple-600">
            Total de registros
          </p>
          <p className="mt-2 text-3xl font-black text-teepopInk">
            {vendas.length}
          </p>
        </div>
      </section>

      <FormCard title="Registrar venda" emoji="🛍️">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
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
              <span className="font-black text-teepopInk">Cliente</span>
              <input
                type="text"
                name="cliente"
                value={form.cliente}
                onChange={handleChange}
                className="input-pop"
                placeholder="Nome do cliente"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="font-black text-teepopInk">Quem vendeu</span>
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
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="font-black text-teepopInk">
                Produto vendido
              </span>
              <input
                type="text"
                name="produto"
                value={form.produto}
                onChange={handleChange}
                className="input-pop"
                placeholder="Ex: Camiseta personalizada na lata"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="font-black text-teepopInk">Quantidade</span>
              <input
                type="number"
                name="quantidade"
                value={form.quantidade}
                onChange={handleChange}
                className="input-pop"
                min="1"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="font-black text-teepopInk">Valor total</span>
              <input
                type="number"
                name="valorTotal"
                value={form.valorTotal}
                onChange={handleChange}
                className="input-pop"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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

            <label className="grid gap-2">
              <span className="font-black text-teepopInk">Status</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-pop"
              >
                {statusVenda.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="font-black text-teepopInk">Observação</span>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              className="input-pop min-h-[90px]"
              placeholder="Ex: Cliente pediu embalagem especial, entrega sábado, pagamento confirmado..."
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-pop bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 text-white disabled:opacity-60"
          >
            {loading ? "Salvando venda..." : "Salvar venda"}
          </button>
        </form>
      </FormCard>

      <section className="rounded-[2rem] bg-white p-5 shadow-pop">
        <h2 className="text-2xl font-black text-teepopInk">
          Histórico de vendas
        </h2>

        {loading ? (
          <LoadingSpinner />
        ) : vendas.length === 0 ? (
          <EmptyState texto="Nenhuma venda registrada ainda." />
        ) : (
          <DataTable
            data={vendas}
            columns={[
              {
                key: "data",
                label: "Data",
                render: (item) => formatDate(item.data),
              },
              { key: "cliente", label: "Cliente" },
              { key: "produto", label: "Produto" },
              { key: "quantidade", label: "Qtd." },
              {
                key: "valorTotal",
                label: "Valor",
                render: (item) => formatCurrency(item.valorTotal),
              },
              { key: "formaPagamento", label: "Pagamento" },
              { key: "socio", label: "Vendido por" },
              { key: "status", label: "Status" },
              { key: "observacao", label: "Observação" },
            ]}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}