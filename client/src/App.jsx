// client/src/App.jsx

import { useCallback, useEffect, useState } from "react";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import Dashboard from "./pages/Dashboard";
import Investimentos from "./pages/Investimentos";
import Despesas from "./pages/Despesas";
import Vendas from "./pages/Vendas";
import Atividades from "./pages/Atividades";
import Oracoes from "./pages/Oracoes";
import Estoque from "./pages/Estoque";
import Relatorios from "./pages/Relatorios";
import {
  addRecord,
  deleteRecord,
  getAllData,
  hasGoogleScriptUrl,
  updateRecord,
} from "./api/googleSheetApi";

const emptyData = {
  config: [],
  socios: [],
  investimentos: [],
  despesas: [],
  vendas: [],
  atividades: [],
  oracoes: [],
  estoque: [],
  logs: [],
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const loadData = useCallback(async () => {
    if (!hasGoogleScriptUrl()) {
      setLoading(false);
      setError(
        "Configure o arquivo .env com VITE_GOOGLE_SCRIPT_URL para conectar ao Google Sheets."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getAllData();

      const cleanData = result?.data ? result.data : result;

      console.log("DADOS VINDO DO GOOGLE SHEETS:", cleanData);
      console.log("ORAÇÕES:", cleanData?.oracoes);

      setData({
        ...emptyData,
        ...cleanData,
        config: cleanData?.config || [],
        socios: cleanData?.socios || [],
        investimentos: cleanData?.investimentos || [],
        despesas: cleanData?.despesas || [],
        vendas: cleanData?.vendas || [],
        atividades: cleanData?.atividades || [],
        oracoes: cleanData?.oracoes || [],
        estoque: cleanData?.estoque || [],
        logs: cleanData?.logs || [],
      });
    } catch (err) {
      console.error("ERRO AO CARREGAR DADOS:", err);
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSave(action, payload) {
    try {
      await addRecord(action, payload);
      showToast("Registro salvo com sucesso! 🌈");
      await loadData();
    } catch (err) {
      showToast(err.message || "Erro ao salvar.", "error");
      throw err;
    }
  }

  async function handleUpdate(sheetName, id, payload) {
    try {
      await updateRecord(sheetName, id, payload);
      showToast("Registro atualizado com sucesso! ✨");
      await loadData();
    } catch (err) {
      showToast(err.message || "Erro ao atualizar.", "error");
      throw err;
    }
  }

  async function handleDelete(sheetName, id, socio) {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      await deleteRecord(sheetName, id, socio);
      showToast("Registro excluído com sucesso.");
      await loadData();
    } catch (err) {
      showToast(err.message || "Erro ao excluir.", "error");
    }
  }

  function renderPage() {
    const props = {
      data,
      records: [],
      onSave: handleSave,
      onUpdate: handleUpdate,
      onDelete: handleDelete,
      refreshData: loadData,
    };

    if (activePage === "investimentos") {
      return (
        <Investimentos
          {...props}
          records={data.investimentos}
        />
      );
    }

    if (activePage === "despesas") {
      return (
        <Despesas
          {...props}
          records={data.despesas}
        />
      );
    }

    if (activePage === "vendas") {
      return (
        <Vendas
          {...props}
          records={data.vendas}
        />
      );
    }

    if (activePage === "atividades") {
      return (
        <Atividades
          {...props}
          records={data.atividades}
        />
      );
    }

    if (activePage === "oracoes") {
      return (
        <Oracoes
          {...props}
          records={data.oracoes}
        />
      );
    }

    if (activePage === "estoque") {
      return (
        <Estoque
          {...props}
          records={data.estoque}
        />
      );
    }

    if (activePage === "relatorios") {
      return <Relatorios data={data} />;
    }

    return <Dashboard data={data} setActivePage={setActivePage} />;
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage} toast={toast}>
      {loading ? (
        <LoadingSpinner texto="Conectando ao Google Sheets..." />
      ) : null}

      {!loading && error ? (
        <div className="rounded-[2rem] bg-white p-6 shadow-pop">
          <div className="rainbow-line -mx-6 -mt-6 mb-6" />

          <h1 className="text-3xl font-black text-teepopInk">
            Configuração necessária
          </h1>

          <p className="mt-3 font-bold text-red-500">{error}</p>

          <p className="mt-3 font-semibold text-purple-600">
            Depois de publicar o Google Apps Script como Web App, copie a URL e
            crie o arquivo{" "}
            <code className="rounded bg-purple-100 px-2 py-1">client/.env</code>{" "}
            com a variável VITE_GOOGLE_SCRIPT_URL.
          </p>

          <button
            onClick={loadData}
            className="btn-pop mt-5 bg-teepopPink text-white"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {!loading && !error ? renderPage() : null}
    </Layout>
  );
}