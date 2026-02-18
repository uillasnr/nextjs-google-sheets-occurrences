"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Truck, X, Package } from "lucide-react";

import Filtros from "./components/Filtros";
import ListaExpedicao from "./components/ListaExpedicao";
import ModalCadastrarNF from "./components/ModalCadastrarNF";
import Sidebar from "@/app/components/Sidebar";
import HeaderExpedicao from "./components/HeaderExpedicao";
import StatusCard from "./components/StatusCard";
import DashboardExpedicao from "./components/Dashboard";
import Loading from "@/components/Loading";
import Romaneio from "./components/Romaneio";
import ModalExpedirSelecionadas from "./components/ModalExpedirSelecionadas";

import { CadastrationExpedicao, Expedicao, Filtro } from "@/types/Expedicao";
import ModalAguardar from "./components/ModalAguardar";

// ---- DADOS MOCK ----
const MOCK_DATA: Expedicao[] = [
  // NF DISPONIVEIS - Cliente com multiplas notas (agrupa)
  {
    id: "m1",
    nota: 45012,
    cliente: "Supermercado Bom Preco",
    dataNota: "2026-02-05",
    volumes: 12,
    status: "NF DISPONIVEIS",
    dataExpedicao: "",
  },
  {
    id: "m2",
    nota: 45013,
    cliente: "Supermercado Bom Preco",
    dataNota: "2026-02-05",
    volumes: 8,
    status: "NF DISPONIVEIS",
    dataExpedicao: "",
  },
  {
    id: "m3",
    nota: 45014,
    cliente: "Supermercado Bom Preco",
    dataNota: "2026-02-06",
    volumes: 5,
    status: "NF DISPONIVEIS",
    dataExpedicao: "",
  },
  // NF DISPONIVEIS - Cliente com nota unica (card individual)
  {
    id: "m4",
    nota: 45020,
    cliente: "Distribuidora Central",
    dataNota: "2026-02-06",
    volumes: 20,
    status: "NF DISPONIVEIS",
    dataExpedicao: "",
  },
  // NF DISPONIVEIS - Outro grupo de 2 notas
  {
    id: "m5",
    nota: 45030,
    cliente: "Loja do Pedro",
    dataNota: "2026-02-04",
    volumes: 3,
    status: "NF DISPONIVEIS",
    dataExpedicao: "",
  },
  {
    id: "m6",
    nota: 45031,
    cliente: "Loja do Pedro",
    dataNota: "2026-02-04",
    volumes: 7,
    status: "NF DISPONIVEIS",
    dataExpedicao: "",
  },
  // NF DISPONIVEIS - Mais individuais
  {
    id: "m7",
    nota: 45040,
    cliente: "Atacado Silva",
    dataNota: "2026-02-07",
    volumes: 15,
    status: "NF DISPONIVEIS",
    dataExpedicao: "",
  },

  // AGUARDANDO - notas esperando retirada
  {
    id: "m8",
    nota: 44980,
    cliente: "Magazine Express",
    dataNota: "2026-02-03",
    volumes: 10,
    status: "AGUARDANDO",
    dataExpedicao: "",
    motorista: "Antonio Pereira",
    cpf: "456.789.123-00",
    placa: "QWE-4R56",
  },
  {
    id: "m9",
    nota: 44990,
    cliente: "Loja das Tintas",
    dataNota: "2026-02-02",
    volumes: 6,
    status: "AGUARDANDO",
    dataExpedicao: "",
    motorista: "Antonio Pereira",
    cpf: "456.789.123-00",
    placa: "QWE-4R56",
  },
  {
    id: "m10",
    nota: 44995,
    cliente: "Loja das Tintas",
    dataNota: "2026-02-01",
    volumes: 18,
    status: "AGUARDANDO",
    dataExpedicao: "",
    motorista: "Antonio Pereira",
    cpf: "456.789.123-00",
    placa: "QWE-4R56",
  },
  {
    id: "m101",
    nota: 44965,
    cliente: "Loja das Tintas",
    dataNota: "2026-02-01",
    volumes: 21,
    status: "AGUARDANDO",
    dataExpedicao: "",
    motorista: "Antonio Pereira",
    cpf: "456.789.123-00",
    placa: "QWE-4R56",
  },

  // EXPEDIDO - notas ja expedidas
  {
    id: "m11",
    nota: 44900,
    cliente: "Mercearia Alvorada",
    dataNota: "2026-01-28",
    volumes: 4,
    status: "EXPEDIDO",
    dataExpedicao: "2026-02-01",
    motorista: "Carlos Silva",
    cpf: "123.456.789-00",
    placa: "ABC-1D23",
  },
  {
    id: "m12",
    nota: 44910,
    cliente: "Padaria Pao Quente",
    dataNota: "2026-01-29",
    volumes: 2,
    status: "EXPEDIDO",
    dataExpedicao: "2026-02-02",
    motorista: "Jose Santos",
    cpf: "987.654.321-00",
    placa: "XYZ-9E87",
  },
  {
    id: "m14",
    nota: 44911,
    cliente: "Padaria Pao Quente",
    dataNota: "2026-01-29",
    volumes: 2,
    status: "EXPEDIDO",
    dataExpedicao: "2026-02-02",
    motorista: "Jose Santos",
    cpf: "987.654.321-00",
    placa: "XYZ-9E87",
  },
  {
    id: "m15",
    nota: 44920,
    cliente: "Casa & Construcao",
    dataNota: "2026-01-30",
    volumes: 25,
    status: "EXPEDIDO",
    dataExpedicao: "2026-02-03",
    motorista: "Antonio Pereira",
    cpf: "456.789.123-00",
    placa: "QWE-4R56",
  },
];

const USE_MOCK = true;

export default function ExpedicaoPage() {
  const router = useRouter();
  const [lista, setLista] = useState<Expedicao[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("NF DISPONIVEIS");
  const [busca, setBusca] = useState("");
  const [modalCadastro, setModalCadastro] = useState(false);
  const [romaneioInitialCliente, setRomaneioInitialCliente] = useState<string | null>(null);
  const [romaneioInitialSelecionadas, setRomaneioInitialSelecionadas] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [abrirRomaneio, setAbrirRomaneio] = useState(false);
  const [modalAguardar, setModalAguardar] = useState<Expedicao | null>(null);

  // Estado de selecao para expedicao
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalExpedir, setModalExpedir] = useState(false);

  useEffect(() => {
    if (USE_MOCK) {
      setLista(MOCK_DATA);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    fetch("/api/expedicao")
      .then((r) => r.json())
      .then((data: Expedicao[]) => {
        setLista(data);
      })
      .finally(() => setCarregando(false));
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

  const notasSelecionadas = useMemo(() => {
    return lista.filter((nf) => selectedIds.includes(nf.id));
  }, [lista, selectedIds]);

  const totalVolumesSelecionados = useMemo(() => {
    return notasSelecionadas.reduce((acc, nf) => acc + Number(nf.volumes || 0), 0);
  }, [notasSelecionadas]);

  const cadastrarNF = async (novo: CadastrationExpedicao) => {
    if (USE_MOCK) {
      const criado: Expedicao = {
        ...novo,
        status: "NF DISPONIVEIS",
        dataExpedicao: "",
      };
      setLista((prev) => [criado, ...prev]);
      return;
    }
    const res = await fetch("/api/expedicao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });
    const criado: Expedicao = await res.json();
    setLista((prev) => [criado, ...prev]);
  };

  const confirmarAguardar = async (atualizado: Expedicao) => {
    if (!USE_MOCK) {
      await fetch(`/api/expedicao/${atualizado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizado),
      });
    }

    setLista((prev) =>
      prev.map((i) =>
        i.id === atualizado.id ? { ...i, ...atualizado, status: "AGUARDANDO" } : i
      )
    );

    setModalAguardar(null);
  };

  const expedirNF = async (atualizado: Expedicao) => {
    if (!USE_MOCK) {
      const res = await fetch(`/api/expedicao/${atualizado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizado),
      });
      const salvo: Expedicao = await res.json();
      setLista((prev) =>
        prev.map((i) =>
          i.id === salvo.id ? { ...i, ...salvo, status: "EXPEDIDO" as const } : i
        )
      );
      return;
    }
    setLista((prev) =>
      prev.map((i) =>
        i.id === atualizado.id
          ? { ...i, ...atualizado, status: "EXPEDIDO" as const }
          : i
      )
    );
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleExpedirSelecionadas = (ids: string[]) => {
    setLista((prev) =>
      prev.map((nf) =>
        ids.includes(nf.id)
          ? { ...nf, status: "EXPEDIDO" as const, dataExpedicao: new Date().toISOString().split("T")[0] }
          : nf
      )
    );
    setSelectedIds([]);
    setModalExpedir(false);
  };

  if (carregando) {
    return <Loading isOpen text="Carregando controle de Retira" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <HeaderExpedicao onCadastrar={() => setModalCadastro(true)} />

      <Sidebar
        goToHome={() => router.push("/")}
        goToDashboard={() => {}}
        onSearchNF={() => false}
        occurrences={[]}
        sheet="SP"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-5">
            <StatusCard
              lista={lista}
              filtroAtual={filtro}
              setFiltro={setFiltro}
            />
            <Filtros
              filtro={filtro}
              setFiltro={(f) => {
                if (!abrirRomaneio) setFiltro(f);
              }}
              busca={busca}
              setBusca={(b) => {
                if (!abrirRomaneio) setBusca(b);
              }}
              onAbrirRomaneio={() => {
                setAbrirRomaneio(true);
                setBusca("");
                setFiltro("TODOS");
              }}
              romaneioAtivo={abrirRomaneio}
            />
          </div>

          <div className="lg:col-span-1">
            <DashboardExpedicao lista={lista} />
          </div>
        </div>

        {abrirRomaneio ? (
          <Romaneio
            lista={lista}
            onClose={() => {
              setAbrirRomaneio(false);
              setRomaneioInitialCliente(null);
              setRomaneioInitialSelecionadas([]);
            }}
            onConfirm={(ids) => {
              setLista((prev) =>
                prev.map((nf) =>
                  ids.includes(nf.id) ? { ...nf, status: "EXPEDIDO" } : nf
                )
              );
              setAbrirRomaneio(false);
              setRomaneioInitialCliente(null);
              setRomaneioInitialSelecionadas([]);
            }}
            initialCliente={romaneioInitialCliente}
            initialSelecionadas={romaneioInitialSelecionadas}
          />
        ) : filtrados.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Nenhuma nota encontrada
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Tente ajustar os filtros ou cadastre uma nova nota
            </p>
          </div>
        ) : (
          <ListaExpedicao
            lista={filtrados}
            onExpedir={(item) => {
              setRomaneioInitialCliente(item.cliente || null);
              setRomaneioInitialSelecionadas([item.id]);
              setAbrirRomaneio(true);
            }}
            onAguardar={(item) => setModalAguardar(item)}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}
      </div>

      {/* Floating Action Bar - aparece quando ha notas selecionadas */}
      {selectedIds.length > 0 && !abrirRomaneio && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gray-900 dark:bg-gray-100 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-5 border border-gray-700 dark:border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white dark:text-gray-900">
                  {selectedIds.length} nota{selectedIds.length > 1 ? "s" : ""} selecionada{selectedIds.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  {totalVolumesSelecionados} volumes no total
                </p>
              </div>
            </div>

            <div className="w-px h-8 bg-gray-700 dark:bg-gray-300" />

            <button
              onClick={() => setSelectedIds([])}
              className="p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-900 transition-colors"
              title="Limpar selecao"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={() => setModalExpedir(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Truck className="w-5 h-5" />
              Expedir Selecionadas
            </button>
          </div>
        </div>
      )}

      {/* Modal Cadastro */}
      {modalCadastro && (
        <ModalCadastrarNF
          onClose={() => setModalCadastro(false)}
          onSave={cadastrarNF}
        />
      )}

      {/* Modal Aguardar */}
      {modalAguardar && (
        <ModalAguardar
          item={modalAguardar}
          onClose={() => setModalAguardar(null)}
          onConfirm={confirmarAguardar}
        />
      )}

      {/* Modal Expedir Selecionadas */}
      {modalExpedir && notasSelecionadas.length > 0 && (
        <ModalExpedirSelecionadas
          notas={notasSelecionadas}
          onClose={() => setModalExpedir(false)}
          onConfirm={handleExpedirSelecionadas}
        />
      )}
    </div>
  );
}
