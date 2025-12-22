"use client";

import type React from "react";
import { formatDateBR } from "@/lib/formatDate";
import type { Occurrence } from "@/types/occurrence";
import {
  Package,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  XCircle,
  Edit,
  Trash2,
  FileText,

} from "lucide-react";
import { useState } from "react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface OccurrenceCardProps {
  item: Occurrence;
  onEdit: (item: Occurrence) => void;
  onDelete: (id: string) => void;
}

const isValidValue = (value?: string) =>
  value && value !== "#VALUE!" ? value : "";

export default function OccurrenceCard({
  item,
  onEdit,
  onDelete,
}: OccurrenceCardProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);


  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { bg: string; text: string; icon: React.ReactNode; dot: string }
    > = {
      Resolvido: {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        dot: "bg-emerald-500",
      },
      Pendente: {
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        icon: <Clock className="w-3.5 h-3.5" />,
        dot: "bg-amber-500",
      },
      "Em Andamento": {
        bg: "bg-blue-500/10 dark:bg-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        dot: "bg-blue-500",
      },
      Cancelado: {
        bg: "bg-red-500/10 dark:bg-red-500/20",
        text: "text-red-600 dark:text-red-400",
        icon: <XCircle className="w-3.5 h-3.5" />,
        dot: "bg-red-500",
      },
      "FALTA DE PROVAS": {
        bg: "bg-orange-500/10 dark:bg-orange-500/20",
        text: "text-orange-600 dark:text-orange-400",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        dot: "bg-orange-500",
      },
    };

    return configs[status] || configs.Pendente;
  };

  const statusConfig = getStatusConfig(item.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-xl w-full max-w-full overflow-hidden  shadow-md shadow-gray-400 dark:shadow-gray-900">
      {/* Header */}
      <div
        className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 rounded-md
                shadow-md shadow-gray-400 dark:shadow-gray-900"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-h-[60px]">
          {/* Left side */}
          <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 rounded-lg border border-blue-500/20 flex-shrink-0">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 dark:text-gray-100 font-bold text-lg truncate">
                NF-{item.nota}
              </h3>

              {/* Pedido e Volume */}
              <div className="flex flex-nowrap items-center gap-4 mt-1">
                <span className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5 text-gray-600 dark:text-gray-400 text-xs">
                  Pedido:{" "}
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {item.pedido}
                  </span>
                </span>

                <span className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5 text-gray-600 dark:text-gray-400 text-xs">
                  Volume:{" "}
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {item.volumes}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] sm:text-[13px] font-semibold
     ${statusConfig.bg} ${statusConfig.text} border border-current self-start mt-1 sm:mt-0`}
          >
            {item.status}
          </span>
        </div>
      </div>

      {/* Content */}
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Info Grid */}
        <InfoCard
          icon={<User className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          label="Cliente"
          value={item.cliente}
        />
        <div className="grid grid-cols-2 gap-2">
          <InfoCard
            icon={
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            }
            label="Solicitante"
            value={item.solicitante}
          />
          <InfoCard
            icon={
              <Truck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            }
            label="Transportadora"
            value={item.transportadora}
          />
          {item.pendencia && (
            <InfoCard
              label="Responsável"
              value={item.pendencia}
              icon={
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              }
            />
          )}
          <InfoCard
            icon={
              <Package className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            }
            label="Tipo de Ocorrência"
            value={item.tipo}
          />
        </div>

        {/* Destination */}
        {isValidValue(item.destino) && (
          <div className="border-b border-t py-1 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500/10 dark:bg-blue-500/20 p-1.5 rounded-lg">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                  Destino
                </p>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm truncate">
                  {item.destino} {item.estado && `- ${item.estado}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Linha do Tempo
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <DateInfo label="Nota" value={formatDateBR(item.dataNota)} />
            <DateInfo
              label="Ocorrência"
              value={formatDateBR(item.dataOcorrencia)}
            />
            <DateInfo
              label="Atualização"
              value={formatDateBR(item.ultimaOcorrencia)}
            />
          </div>
          {item.tracking && (
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <p className="text-gray-900 dark:text-gray-100 font-mono text-xs">
                {item.tracking} dias em aberto
              </p>
            </div>
          )}
        </div>

        {/* Status Detalhado */}
        {(item.statusCliente || item.statusTransportadora) && (
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 overflow-x-auto">
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status Ocorrências
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.statusCliente && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 hover:border-blue-500/50 transition-colors truncate">
                  <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">
                    Cliente
                  </p>
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.statusCliente}
                  </p>
                </div>
              )}
              {item.statusTransportadora && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 hover:border-blue-500/50 transition-colors truncate">
                  <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">
                    Transportadora
                  </p>
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.statusTransportadora}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Text Blocks */}
        {(item.ocorrencia || item.obs || item.pendencia) && (
          <div className="space-y-2">
            {item.ocorrencia && (
              <TextBlock
                title="Motivo da Ocorrência"
                value={item.ocorrencia}
                icon={
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                }
              />
            )}
            {item.obs && (
              <TextBlock
                title="Observações"
                value={item.obs}
                icon={
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                }
              />
            )}
          </div>
        )}
        {/* MODAL DE CONFIRMAÇÃO */}
<ConfirmDeleteModal
  isOpen={openDeleteModal}
  onClose={() => {
    setOpenDeleteModal(false);
    setSelectedId(null);
  }}
  onConfirm={(password, setError) => {
    if (password !== "102030") {
      setError("Senha incorreta ❌");
      return;
    }

    if (selectedId) {
      onDelete(selectedId);
    }

    setOpenDeleteModal(false);
    setSelectedId(null);
  }}
/>



        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onEdit(item)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm shadow-lg flex-1 group"
          >
            <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Editar
          </button>
          <button
            onClick={() => {
    if (!item.id) return;
    setSelectedId(item.id);
    setOpenDeleteModal(true);
  }}
            
            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm shadow-lg flex-1 group border border-gray-200 dark:border-gray-600"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}



/* Componentes auxiliares */
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="truncate">
      <div className="flex items-center gap-2">
        <div>{icon}</div>
        <div className="flex-1 min-w-0 truncate">
          <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-0.5 truncate">
            {label}
          </p>
          <p className="text-gray-900 dark:text-gray-100 font-medium text-xs truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function DateInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 hover:border-blue-500/50 transition-colors truncate">
      <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-0.5 uppercase tracking-wider truncate">
        {label}
      </p>
      <p className="text-gray-900 dark:text-gray-100 font-semibold text-[11px] truncate">
        {value}
      </p>
    </div>
  );
}

function TextBlock({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 hover:border-blue-500/50 transition-colors truncate">
      <div className="flex items-center gap-1.5 mb-1.5 truncate">
        {icon}
        <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider truncate">
          {title}
        </p>
      </div>
      <p className="text-xs text-gray-900 dark:text-gray-100 leading-relaxed truncate">
        {value}
      </p>
    </div>
  );
}


