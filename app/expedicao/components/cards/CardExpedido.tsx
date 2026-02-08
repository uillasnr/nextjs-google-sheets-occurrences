"use client";

import { Expedicao } from "@/types/Expedicao";
import { formatDateBR } from "@/lib/formatDate";
import {
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Clock,
} from "lucide-react";

export default function CardExpedido({
  item,
  index,
  expandedId,
  toggleExpand,
  compact = false,
}: {
  item: Expedicao;
  index: number;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  compact?: boolean;
}) {
  const isExpanded = expandedId === item.id;

  return (
    <div
      className={`bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 overflow-hidden
        transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-800/50
        animate-in fade-in slide-in-from-bottom-2 ${compact ? "rounded-xl" : "rounded-2xl"}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={compact ? "p-3" : "p-4"}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className={`${compact ? "p-2" : "p-2.5"} rounded-xl bg-emerald-50 dark:bg-emerald-900/20`}>
                <CheckCircle2 className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-emerald-600 dark:text-emerald-400`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className={`font-bold text-gray-900 dark:text-gray-100 ${compact ? "text-sm" : "text-base"}`}>
                    NF {item.nota}
                  </h3>
                  {!compact && (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">
                      Expedido
                    </span>
                  )}
                </div>
                {!compact && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.cliente}
                  </p>
                )}
              </div>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 ${compact ? "ml-10" : "ml-12"}`}>
              <div className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"} text-gray-500 dark:text-gray-400`}>
                <Calendar className="w-3.5 h-3.5" />
                {formatDateBR(item.dataNota)}
              </div>
              <div className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"} text-gray-500 dark:text-gray-400`}>
                <Package className="w-3.5 h-3.5" />
                {item.volumes} vol.
              </div>
              {item.dataExpedicao && (
                <div className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"} text-gray-500 dark:text-gray-400`}>
                  <Clock className="w-3.5 h-3.5" />
                  {item.dataExpedicao}
                </div>
              )}
              {item.motorista && (
                <div className={`flex items-center gap-2 ${compact ? "text-xs" : "text-sm"} text-gray-500 dark:text-gray-400`}>
                  <Truck className="w-3.5 h-3.5" />
                  {item.motorista}
                </div>
              )}
            </div>
          </div>

          {!compact && (
            <button
              type="button"
              onClick={() => toggleExpand(item.id)}
              className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold
                bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                border border-emerald-500/30 hover:bg-emerald-500/20
                transition-all duration-200 flex items-center justify-center gap-2"
            >
              Ver Detalhes
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {isExpanded && !compact && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Dados do Transporte
              </h4>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Motorista</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.motorista || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Placa</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {item.placa || "-"}
                  </span>
                </div>
                {item.cpf && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">CPF</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.cpf}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Datas
              </h4>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Data da Nota</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDateBR(item.dataNota)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Data Expedição</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.dataExpedicao || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
