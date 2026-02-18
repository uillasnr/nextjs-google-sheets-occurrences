"use client";

import { Expedicao } from "@/types/Expedicao";
import { formatDateBR } from "@/lib/formatDate";
import {
  User,
  Calendar,
  Package,
  Truck,
  Clock,
  ChevronUp,
  ChevronDown,
  Hash,
  Check,
} from "lucide-react";
import InfoBlock from "../../InfoBlock";

export default function CardAguardando({
  item,
  index,
  expandedId,
  toggleExpand,
  onExpedir,
  compact = false,
  selectable = false,
  selected = false,
  onToggleSelect,
}: {
  item: Expedicao;
  index: number;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  onExpedir: () => void;
  compact?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  const isExpanded = expandedId === item.id;

  return (
    <div
      className={`bg-white dark:bg-gray-800/50 border overflow-hidden
        transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-800/50
        animate-in fade-in slide-in-from-bottom-2 ${compact ? "rounded-xl" : "rounded-2xl"}
        ${selected
          ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800/60"
          : "border-gray-200 dark:border-gray-700 hover:border-amber-400/50"
        }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={compact ? "p-3" : "p-4"}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              {/* Checkbox para selecao */}
              {selectable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect?.();
                  }}
                  className={`shrink-0 mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                    ${selected
                      ? "bg-blue-600 border-blue-600 text-white scale-110"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                    }`}
                >
                  {selected && <Check className="w-4 h-4" />}
                </button>
              )}

              <div
                className={`${compact ? "p-2" : "p-2.5"} rounded-xl bg-amber-50 dark:bg-amber-900/20`}
              >
                <Clock
                  className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-amber-600 dark:text-amber-400`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3
                    className={`font-bold text-gray-900 dark:text-gray-100 ${compact ? "text-sm" : "text-base"}`}
                  >
                    NF {item.nota}
                  </h3>
                  {!compact && (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold">
                      Aguardando Retirada
                    </span>
                  )}
                </div>
                {!compact && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {item.cliente}
                  </p>
                )}
              </div>
            </div>

            {!compact && (
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${selectable ? "ml-[4.5rem]" : "ml-12"}`}>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {formatDateBR(item.dataNota)}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.volumes} volumes
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.motorista}
                  </span>
                </div>
              </div>
            )}

            {compact && (
              <div className={`flex items-center gap-3 ${selectable ? "ml-[4.5rem]" : "ml-11"} text-xs text-gray-500 dark:text-gray-400`}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateBR(item.dataNota)}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {item.volumes} vol.
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  {item.motorista}
                </span>
              </div>
            )}
          </div>

          <div className="flex lg:flex-col items-center gap-3">
            {!selectable && (
              <button
                type="button"
                onClick={onExpedir}
                className={`w-full lg:w-auto ${compact ? "px-4 py-2" : "px-6 py-3"} rounded-xl text-sm font-bold
                  bg-amber-500 hover:bg-amber-600 text-white
                  shadow-lg shadow-amber-500/20
                  transition-all duration-200 hover:scale-105 active:scale-95
                  flex items-center justify-center gap-2`}
              >
                <Truck className="w-4 h-4" />
                Expedir
              </button>
            )}

            {!compact && (
              <button
                type="button"
                onClick={() => toggleExpand(item.id)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 
                  flex items-center gap-1 transition-colors"
              >
                {isExpanded ? "Menos" : "Detalhes"}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {isExpanded && !compact && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                Dados da Nota
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoBlock
                  label="Cliente"
                  value={item.cliente}
                  icon={<User className="w-4 h-4 text-amber-500" />}
                />
                <InfoBlock
                  label="Numero da Nota"
                  value={`NF ${item.nota}`}
                  icon={<Hash className="w-4 h-4 text-amber-500" />}
                />
                <InfoBlock
                  label="Data da Nota"
                  value={formatDateBR(item.dataNota)}
                  icon={<Calendar className="w-4 h-4 text-amber-500" />}
                />
                <InfoBlock
                  label="Volumes"
                  value={`${item.volumes} volumes`}
                  icon={<Package className="w-4 h-4 text-amber-500" />}
                />
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800 shadow-sm">
              <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-3 uppercase tracking-wide">
                Dados da Retirada
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoBlock
                  label="Motorista"
                  value={item.motorista || "Nao informado"}
                  icon={<User className="w-4 h-4 text-amber-600" />}
                />
                <InfoBlock
                  label="CPF do Motorista"
                  value={item.cpf || "Nao informado"}
                  icon={<User className="w-4 h-4 text-amber-600" />}
                />
                <InfoBlock
                  label="Placa do Veiculo"
                  value={item.placa || "Nao informado"}
                  icon={<Truck className="w-4 h-4 text-amber-600" />}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
