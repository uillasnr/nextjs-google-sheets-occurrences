"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

import Filtros from "./components/Filtros";
import ListaExpedicao from "./components/ListaExpedicao";
import ModalCadastrarNF from "./components/ModalCadastrarNF";
import ModalExpedir from "./components/ModalExpedir";
import Sidebar from "@/app/components/Sidebar";

import { CadastrationExpedicao, Expedicao, Filtro } from "@/types/Expedicao";
import HeaderExpedicao from "./components/HeaderExpedicao";
import StatusCard from "./components/StatusCard";
import DashboardExpedicao from "./components/Dashboard";
import Loading from "@/components/Loading";

export default function ExpedicaoPage() {
  const router = useRouter();
  const [lista, setLista] = useState<Expedicao[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("PENDENTE");
  const [busca, setBusca] = useState("");
  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalExpedir, setModalExpedir] = useState<Expedicao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    fetch("/api/expedicao")
      .then((r) => r.json())
      .then((data: Expedicao[]) => {
        setLista(data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  const filtrados = useMemo(() => {
    return lista.filter((item) => {
      const filtroOK = filtro === "TODOS" || item.status === filtro;

      const buscaOK =
        String(item.nota).toLowerCase().includes(busca.toLowerCase()) ||
        String(item.cliente).toLowerCase().includes(busca.toLowerCase());

      return filtroOK && buscaOK;
    });
  }, [lista, filtro, busca]);

  // ✅ CADASTRAR NF
  const cadastrarNF = async (novo: CadastrationExpedicao) => {
    const res = await fetch("/api/expedicao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });

    const criado: Expedicao = await res.json();

    setLista((prev) => [criado, ...prev]);
  };

  // ✅ EXPEDIR NF
  const expedirNF = async (atualizado: Expedicao) => {
    const res = await fetch(`/api/expedicao/${atualizado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(atualizado),
    });

    const salvo: Expedicao = await res.json();

    setLista((prev) => prev.map((i) => (i.id === salvo.id ? salvo : i)));
  };

  // ⛔ BLOQUEIA A TELA ENQUANTO CARREGA
  if (carregando) {
    return <Loading isOpen text="Carregando controle de Retira" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* HEADER */}
      <HeaderExpedicao onCadastrar={() => setModalCadastro(true)} />

      {/* SIDEBAR */}
      <Sidebar
        goToHome={() => router.push("/")}
        goToDashboard={() => {}}
        onSearchNF={() => false}
        occurrences={[]}
        sheet="SP"
      />

      {/* CONTEÚDO */}
      <div className="max-w-7xl mx-auto px-6 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* COLUNA ESQUERDA */}
          <div className="lg:col-span-2 space-y-6">
            <StatusCard
              lista={lista}
              filtroAtual={filtro}
              setFiltro={setFiltro}
            />
            <Filtros
              filtro={filtro}
              setFiltro={setFiltro}
              busca={busca}
              setBusca={setBusca}
            />
          </div>

          {/* COLUNA DIREITA */}
          <div className="lg:col-span-1">
            <DashboardExpedicao lista={lista} />
          </div>
        </div>

        {carregando ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">Nenhuma nota encontrada</p>
          </div>
        ) : (
          <ListaExpedicao
            lista={filtrados}
            onExpedir={(item) => setModalExpedir(item)}
          />
        )}
      </div>

      {/* MODAIS */}
      {modalCadastro && (
        <ModalCadastrarNF
          onClose={() => setModalCadastro(false)}
          onSave={cadastrarNF}
        />
      )}

      {modalExpedir && (
        <ModalExpedir
          item={modalExpedir}
          onClose={() => setModalExpedir(null)}
          onConfirm={expedirNF}
        />
      )}
    </div>
  );
}
