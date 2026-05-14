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

const APP_PASSWORD = "teepop2026";
const STORAGE_KEY = "teepop_app_unlocked";

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
  const [unlocked, setUnlocked] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [activePage, setActivePage] = useState("dashboard");
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  function handleUnlock(e) {
    e.preventDefault();

    if (password.trim() === APP_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
      setPassword("");
      setPasswordError("");
      return;
    }

    setPasswordError("Senha incorreta. Tente novamente.");
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setUnlocked(false);
    setPassword("");
    setActivePage("dashboard");
  }

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

      const nextData = {
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
      };

      console.log("TeePoP dados carregados:", nextData);
      console.log("Investimentos carregados:", nextData.investimentos);
      console.log("Despesas carregadas:", nextData.despesas);

      setData(nextData);
    } catch (err) {
      console.error("ERRO AO CARREGAR DADOS:", err);
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (unlocked) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [unlocked, loadData]);

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
      onSave: handleSave,
      onUpdate: handleUpdate,
      onDelete: handleDelete,
      refreshData: loadData,
    };

    if (activePage === "investimentos") {
      return <Investimentos {...props} records={data.investimentos || []} />;
    }

    if (activePage === "despesas") {
      return <Despesas {...props} records={data.despesas || []} />;
    }

    if (activePage === "vendas") {
      return <Vendas {...props} records={data.vendas || []} />;
    }

    if (activePage === "atividades") {
      return <Atividades {...props} records={data.atividades || []} />;
    }

    if (activePage === "oracoes") {
      return <Oracoes {...props} records={data.oracoes || []} />;
    }

    if (activePage === "estoque") {
      return <Estoque {...props} records={data.estoque || []} />;
    }

    if (activePage === "relatorios") {
      return <Relatorios data={data} />;
    }

    return <Dashboard data={data} setActivePage={setActivePage} />;
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-cyan-100 px-4 py-8">
        <section className="mx-auto flex min-h-[85vh] max-w-xl items-center justify-center">
          <div className="w-full overflow-hidden rounded-[2rem] bg-white/95 shadow-pop">
            <div className="rainbow-line" />

            <div className="p-6 text-center sm:p-8">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-pink-500 via-yellow-300 to-sky-400 text-5xl shadow-lg">
                🔐
              </div>

              <p className="badge-pop mx-auto mt-6 w-fit bg-pink-100 text-teepopPink">
                Acesso protegido TeePoP
              </p>

              <h1 className="mt-4 text-4xl font-black text-teepopInk">
                Caixa & Gestão
              </h1>

              <p className="mt-3 text-base font-bold text-purple-600">
                Digite a senha geral para desbloquear o painel da TeePoP.
              </p>

              <form onSubmit={handleUnlock} className="mt-6 grid gap-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className="input-pop text-center text-xl font-black"
                  placeholder="Digite a senha"
                  autoFocus
                />

                {passwordError ? (
                  <p className="rounded-2xl bg-red-50 p-3 text-sm font-black text-red-600">
                    ⚠️ {passwordError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn-pop bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 text-white"
                >
                  Desbloquear sistema
                </button>
              </form>

              <p className="mt-5 text-xs font-bold text-slate-500">
                Acesso reservado aos sócios autorizados.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage} toast={toast}>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-2xl bg-white/90 px-4 py-2 text-sm font-black text-red-500 shadow-sm hover:bg-red-50"
        >
          🔒 Bloquear sistema
        </button>
      </div>

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