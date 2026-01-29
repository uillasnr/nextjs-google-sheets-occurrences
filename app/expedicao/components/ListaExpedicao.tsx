import { formatDateBR } from "@/lib/formatDate";
import { Expedicao } from "@/types/Expedicao";
import { useState } from "react";
import {
  FileText,
  User,
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function ListaExpedicao({
  lista,
  onExpedir,
}: {
  lista: Expedicao[];
  onExpedir: (item: Expedicao) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {lista.map((item, index) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden
            transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-700 hover:border-blue-500/50
            animate-in fade-in slide-in-from-bottom-2"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Main Content */}
          <div className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Section - Info */}
              <div className="flex-1 space-y-1">
                {/* Header with NF and Client */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-700">
                    <FileText
                      className={`w-6 h-6 ${
                        item.status === "EXPEDIDO"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        NF {item.nota}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.cliente}
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2  px-3 py-2">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Data da nota: {formatDateBR(item.dataNota)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2  px-3 py-2">
                    <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white ">
                      {item.volumes} volumes
                    </span>
                  </div>
                  {item.status === "EXPEDIDO" && item.dataExpedicao && (
                    <div className="flex items-center gap-2  px-3 py-2">
                      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Data de expedição: {item.dataExpedicao}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Action */}
              <div className="flex lg:flex-col items-center gap-3">
                {item.status === "PENDENTE" ? (
                  <button
                    type="button"
                    onClick={() => onExpedir(item)}
                    className="w-full lg:w-auto px-6 py-3 rounded-xl text-sm font-bold 
                      bg-gradient-to-r from-amber-500 to-amber-600 
                      hover:from-amber-600 hover:to-amber-700
                      text-white shadow-lg shadow-amber-500/25
                      transition-all duration-200 hover:scale-105 active:scale-95
                      flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Expedir
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="w-full lg:w-auto px-5 py-3 rounded-xl text-sm font-bold 
                      bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 
                      border border-emerald-500/30 hover:bg-emerald-500/20
                      transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Ver Detalhes
                    {expandedId === item.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Expanded Details for EXPEDIDO */}
          {item.status === "EXPEDIDO" && expandedId === item.id && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transporte Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Dados do Transporte
                  </h4>
                  <div className="bg-white dark:bg-gray-800/50  rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Motorista
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.motorista || "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Placa
                      </span>
                      <span className="text-sm font-bold text-white">
                        {item.placa || "-"}
                      </span>
                    </div>
                    {item.cpf && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          CPF Motorista
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.cpf}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CPF Info */}
                {item.cpf && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Informações Adicionais
                    </h4>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Data Expedição
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.dataExpedicao || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {lista.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Nenhuma nota encontrada
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Cadastre uma nova nota para começar
          </p>
        </div>
      )}
    </div>
  );
}
