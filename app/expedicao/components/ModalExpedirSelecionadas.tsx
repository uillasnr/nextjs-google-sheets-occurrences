"use client";

import { useState, useMemo } from "react";
import { Expedicao } from "@/types/Expedicao";
import { formatDateBR } from "@/lib/formatDate";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RomaneioPDF } from "./RomaneioPDF";
import {
  Truck,
  Package,
  User,
  Calendar,
  CheckCircle2,
  FileText,
  X,
  ChevronRight,
  ChevronLeft,
  Hash,
  Download,
  ArrowRight,
} from "lucide-react";

type Props = {
  notas: Expedicao[];
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
};

type Step = "revisar" | "confirmar" | "concluido";

export default function ModalExpedirSelecionadas({
  notas,
  onClose,
  onConfirm,
}: Props) {
  const [step, setStep] = useState<Step>("revisar");
// ADICIONE no topo junto com os outros useState
const [responsavelExpedicao, setResponsavelExpedicao] = useState("");

  const totalVolumes = useMemo(
    () => notas.reduce((acc, nf) => acc + Number(nf.volumes || 0), 0),
    [notas]
  );

  // Pega os dados de transporte da primeira nota (todos compartilham o mesmo motorista)
  const motorista = notas[0]?.motorista || "";
  const cpf = notas[0]?.cpf || "";
  const placa = notas[0]?.placa || "";
  const cliente = notas[0]?.cliente || "";

  // Agrupa por cliente para exibicao
  const gruposPorCliente = useMemo(() => {
    const mapa: Record<string, Expedicao[]> = {};
    notas.forEach((nf) => {
      const key = nf.cliente?.trim() || "Sem cliente";
      if (!mapa[key]) mapa[key] = [];
      mapa[key].push(nf);
    });
    return Object.entries(mapa);
  }, [notas]);

  const handleConfirmar = () => {
    setStep("concluido");
  };

  const handleFinalizar = () => {
    onConfirm(notas.map((nf) => nf.id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              step === "concluido"
                ? "bg-emerald-100 dark:bg-emerald-900/30"
                : "bg-blue-100 dark:bg-blue-900/30"
            }`}>
              {step === "concluido" ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {step === "revisar" && "Revisar Notas Selecionadas"}
                {step === "confirmar" && "Confirmar Expedição"}
                {step === "concluido" && "Expedicao Concluida"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step === "revisar" && `${notas.length} nota${notas.length > 1 ? "s" : ""} selecionada${notas.length > 1 ? "s" : ""}`}
                {step === "confirmar" && "Confira os dados antes de expedir"}
                {step === "concluido" && "Romaneio pronto para download"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            {[
              { key: "revisar", label: "Revisar" },
              { key: "confirmar", label: "Confirmar" },
              { key: "concluido", label: "Concluido" },
            ].map((s, i) => {
              const steps: Step[] = ["revisar", "confirmar", "concluido"];
              const currentIndex = steps.indexOf(step);
              const stepIndex = steps.indexOf(s.key as Step);
              const isActive = s.key === step;
              const isDone = stepIndex < currentIndex;

              return (
                <div key={s.key} className="flex items-center gap-2">
                  {i > 0 && (
                    <div className={`w-8 h-0.5 rounded-full ${isDone || isActive ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                  )}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? "bg-blue-600 text-white"
                          : isActive
                            ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {s.label}
                    </span>
                  </div>
             

                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Revisar */}
          {step === "revisar" && (
            <div className="space-y-4">
              {/* Resumo */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center border border-blue-100 dark:border-blue-800">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{notas.length}</p>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Notas</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-center border border-amber-100 dark:border-amber-800">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{totalVolumes}</p>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Volumes</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-800">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{gruposPorCliente.length}</p>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Cliente{gruposPorCliente.length > 1 ? "s" : ""}</p>
                </div>
              </div>

{/* Responsável pela Expedição */}
<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
    Responsável pela Expedição
  </h4>

  <input
    type="text"
    value={responsavelExpedicao}
    onChange={(e) => setResponsavelExpedicao(e.target.value)}
    placeholder="Digite o nome do responsável"
    className="w-full px-3 py-2 rounded-lg  bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
  />
</div>

              {/* Lista de Notas */}
              <div className="space-y-3">
                {gruposPorCliente.map(([clienteNome, nfs]) => (
                  <div key={clienteNome} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{clienteNome}</span>
                      <span className="ml-auto text-xs font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 px-2 py-0.5 rounded-md">
                        {nfs.length} NF{nfs.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {nfs.map((nf) => (
                        <div key={nf.id} className="px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                              <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                NF {nf.nota}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDateBR(nf.dataNota)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {nf.volumes} vol.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Dados do Transporte */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Dados do Transporte
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2.5 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Motorista</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{motorista || "N/A"}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2.5 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">CPF</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{cpf || "N/A"}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2.5 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Placa</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{placa || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Confirmar */}
          {step === "confirmar" && (
            <div className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 shrink-0">
                    <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 dark:text-amber-300">
                      Confirmar expedição de {notas.length} nota{notas.length > 1 ? "s" : ""}?
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      Esta ação ira alterar o status das notas selecionadas para <strong>EXPEDIDO</strong>.
                      Um romaneio sera gerado automaticamente para download.
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumo Final */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  Resumo da Expedição
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Notas Fiscais
                    </span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      NF {notas.map((nf) => nf.nota).join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Package className="w-4 h-4" /> Total de Volumes
                    </span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{totalVolumes}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <User className="w-4 h-4" /> Motorista
                    </span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{motorista || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Truck className="w-4 h-4" /> Placa
                    </span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{placa || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
     <User className="w-4 h-4" /> Responsável Expedição
  </span>
  <span className="font-bold text-gray-800 dark:text-gray-200">
    {responsavelExpedicao || "N/A"}
  </span>
</div>

                </div>
              </div>
            </div>
          )}

          {/* Step 3: Concluido */}
          {step === "concluido" && (
            <div className="text-center space-y-6 py-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Notas Expedidas com Sucesso!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {notas.length} nota{notas.length > 1 ? "s" : ""} {notas.length > 1 ? "foram alteradas" : "foi alterada"} para o status EXPEDIDO.
                </p>
              </div>

              {/* Resumo rapido */}
              <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800 text-left space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Notas</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{notas.map((nf) => nf.nota).join(", ")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Volumes</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{totalVolumes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Motorista</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{motorista || "N/A"}</span>
                </div>
                 <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Responsável Expedição</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200"> {responsavelExpedicao || "N/A"}</span>
                </div>
              </div>

              {/* Download PDF */}
              <PDFDownloadLink
                document={
                  <RomaneioPDF
                    cliente={cliente}
                    notas={notas}
                    placaVeiculo={placa}
                    nomeMotorista={motorista}
                    cpfMotorista={cpf}
                      responsavelExpedicao={responsavelExpedicao}
                  />
                }
                fileName={`romaneio-${cliente}-${new Date().toISOString().split("T")[0]}.pdf`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
              >
                {({ loading }) =>
                  loading ? (
                    "Gerando PDF..."
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Baixar Romaneio (PDF)
                    </>
                  )
                }
              </PDFDownloadLink>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-gray-800/30">
          {step === "revisar" && (
            <>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-bold bg-gray-200 dark:bg-gray-700  text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep("confirmar")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Continuar
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === "confirmar" && (
            <>
              <button
                onClick={() => setStep("revisar")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                onClick={handleConfirmar}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirmar Expedicao
              </button>
            </>
          )}

          {step === "concluido" && (
            <>
              <div />
              <button
                onClick={handleFinalizar}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-gray-800 dark:bg-gray-200 hover:bg-gray-900 dark:hover:bg-white text-white dark:text-gray-900 transition-all hover:scale-105 active:scale-95"
              >
                Fechar
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
