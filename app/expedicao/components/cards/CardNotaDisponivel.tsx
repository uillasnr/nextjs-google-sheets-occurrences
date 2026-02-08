"use client";

import { FileText, Calendar, Package, ArrowRight } from "lucide-react";
import { formatDateBR } from "@/lib/formatDate";
import { Expedicao } from "@/types/Expedicao";

export default function CardNotaDisponivel({
  item,
  onAguardar,
  compact = false,
}: {
  item: Expedicao;
  onAguardar: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 overflow-hidden
        transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800/40 hover:border-blue-400/50
        ${compact ? "rounded-xl" : "rounded-2xl"}`}
    >
      <div className={compact ? "p-3" : "p-4"}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`${compact ? "p-2" : "p-2.5"} rounded-xl bg-blue-50 dark:bg-blue-900/20 shrink-0`}>
              <FileText className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-blue-600 dark:text-blue-400`} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-bold text-gray-900 dark:text-gray-100 ${compact ? "text-sm" : "text-base"}`}>
                  NF {item.nota}
                </h3>
                {!compact && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold">
                    Disponível
                  </span>
                )}
              </div>
              {!compact && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {item.cliente}
                </p>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-4 ml-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateBR(item.dataNota)}
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                {item.volumes} vol.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onAguardar}
            className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold
              bg-blue-600 hover:bg-blue-700 text-white
              shadow-sm hover:shadow-md transition-all duration-200 
              flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">Aguardar Retirada</span>
            <span className="sm:hidden">Aguardar</span>
          </button>
        </div>

        <div className="flex sm:hidden items-center gap-3 mt-2 ml-11 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDateBR(item.dataNota)}
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {item.volumes} vol.
          </span>
        </div>
      </div>
    </div>
  );
}
