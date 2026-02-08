"use client";

import { useMemo, useState } from "react";
import { Expedicao } from "@/types/Expedicao";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RomaneioPDF } from "./RomaneioPDF";
import { Package } from "lucide-react";

type Props = {
  lista: Expedicao[];
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
};

export default function Romaneio({ lista, onClose, onConfirm }: Props) {
  const [placaVeiculo, setPlacaVeiculo] = useState("");
  const [nomeMotorista, setNomeMotorista] = useState("");
  const [cpfMotorista, setCpfMotorista] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(
    null,
  );
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  // 🔥 AGRUPA POR CLIENTE (AGORA COM 1 OU MAIS NFs)
  const grupos = useMemo(() => {
    const mapa: Record<string, Expedicao[]> = {};

    lista.forEach((nf) => {
      if (nf.status !== "NF DISPONIVEIS" && nf.status !== "AGUARDANDO") return;
      if (!mapa[nf.cliente]) mapa[nf.cliente] = [];
      mapa[nf.cliente].push(nf);
    });

    return Object.entries(mapa).map(([cliente, nfs]) => ({
      cliente,
      nfs,
      multiplas: nfs.length > 1,
    }));
  }, [lista]);

  const romaneioSelecionado = grupos.find(
    (g) => g.cliente === clienteSelecionado,
  );

  function toggleSelecionada(id: string) {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((nfId) => nfId !== id) : [...prev, id],
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* HEADER */}
      <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
            <Package className="text-blue-600 w-7 h-7" />
            Criar Romaneio por Cliente
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Selecione uma ou mais notas fiscais para gerar o romaneio.
          </p>
        </div>
        <button
          onClick={onClose}
          className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Voltar para lista
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-[600px]">
        {/* CLIENTES */}
        <div className="w-full lg:w-80 border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-transparent">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Clientes com NFs pendentes
            </h3>
          </div>

          <ul className="p-4 space-y-2 overflow-y-auto h-[calc(100%-60px)]">
            {grupos.length === 0 && (
              <div className="text-center py-10 px-4">
                <p className="text-sm text-gray-400 italic">
                  Nenhuma NF pendente encontrada.
                </p>
              </div>
            )}

            {grupos.map((grupo) => (
              <li key={grupo.cliente}>
                <button
                  onClick={() => {
                    setClienteSelecionado(grupo.cliente);
                    setSelecionadas([]);
                  }}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    clienteSelecionado === grupo.cliente
                      ? "bg-blue-600 text-white scale-[1.02]"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="font-medium truncate mr-2">
                    {grupo.cliente}
                  </span>

                  <div className="flex items-center gap-2">
                    {grupo.multiplas && (
                      <span className="text-[10px] px-2 py-1 rounded bg-purple-100 text-purple-700 font-bold">
                        AGRUPADO
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 font-bold">
                      {grupo.nfs.length}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* DIREITA */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900">
          {romaneioSelecionado ? (
            <div className="flex flex-col h-full">
              {/* DADOS DO TRANSPORTE */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-50 dark:border-gray-800">
                <Input
                  label="Motorista"
                  value={nomeMotorista}
                  onChange={setNomeMotorista}
                  placeholder="Nome completo"
                />
                <Input
                  label="CPF"
                  value={cpfMotorista}
                  onChange={setCpfMotorista}
                  placeholder="000.000.000-00"
                />
                <Input
                  label="Placa Veículo"
                  value={placaVeiculo}
                  onChange={setPlacaVeiculo}
                  placeholder="ABC-1234"
                />
              </div>

              {/* LISTA DE NFs */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Notas Disponíveis
                </h3>

                {romaneioSelecionado.nfs.map((nf) => {
                  const ativa = selecionadas.includes(nf.id);

                  return (
                    <div
                      key={nf.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        ativa
                          ? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
                          : "border-gray-100 dark:border-gray-800 hover:border-blue-200"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-gray-700 dark:text-gray-200">
                          NF: {nf.nota}
                        </p>
                        <p className="text-xs text-gray-500">
                          {nf.dataNota} • Volumes:{" "}
                          <span className="font-semibold">{nf.volumes}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => toggleSelecionada(nf.id)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                          ativa
                            ? "bg-white text-red-500 border border-red-100 hover:bg-red-50"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        {ativa ? "Remover" : "Adicionar"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* GERAR PDF */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
                <PDFDownloadLink
                  document={
                    <RomaneioPDF
                      cliente={romaneioSelecionado.cliente}
                      notas={romaneioSelecionado.nfs.filter((nf) =>
                        selecionadas.includes(nf.id),
                      )}
                      placaVeiculo={placaVeiculo}
                      nomeMotorista={nomeMotorista}
                      cpfMotorista={cpfMotorista}
                    />
                  }
                  fileName={`romaneio-${romaneioSelecionado.cliente}.pdf`}
                  className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                    selecionadas.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white hover:scale-[1.01]"
                  }`}
                >
                  {({ loading }) =>
                    loading
                      ? "⏳ Gerando PDF..."
                      : selecionadas.length === 1
                        ? "Gerar Romaneio da NF"
                        : `Gerar Romaneio (${selecionadas.length} NFs)`
                  }
                </PDFDownloadLink>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <div className="text-6xl text-gray-200">📋</div>
              <p className="font-medium">
                Selecione um cliente para montar o romaneio.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔹 INPUT PADRÃO
function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
    </div>
  );
}
