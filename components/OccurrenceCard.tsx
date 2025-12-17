"use client"

import type React from "react"

import { formatDateBR } from "@/lib/formatDate"
import type { Occurrence } from "@/types/occurrence"
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
  Hash,
} from "lucide-react"

interface OccurrenceCardProps {
  item: Occurrence
  onEdit: (item: Occurrence) => void
  onDelete: (id: string) => void
}

const isValidValue = (value?: string) => (value && value !== "#VALUE!" ? value : "")

export default function OccurrenceCard({ item, onEdit, onDelete }: OccurrenceCardProps) {
  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { bg: string; text: string; icon: React.ReactNode; dot: string }
    > = {
      Resolvido: {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: <CheckCircle className="w-4 h-4" />,
        dot: "bg-green-500",
      },
      Pendente: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        icon: <Clock className="w-4 h-4" />,
        dot: "bg-yellow-500",
      },
      "Em Andamento": {
        bg: "bg-blue-50",
        text: "text-blue-700",
        icon: <AlertCircle className="w-4 h-4" />,
        dot: "bg-blue-500",
      },
      Cancelado: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: <XCircle className="w-4 h-4" />,
        dot: "bg-red-500",
      },
      "FALTA DE PROVAS": {
        bg: "bg-orange-50",
        text: "text-orange-700",
        icon: <AlertCircle className="w-4 h-4" />,
        dot: "bg-orange-500",
      },
    }

    return configs[status] || configs.Pendente
  }

  const statusConfig = getStatusConfig(item.status)

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg flex-shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-xl sm:text-2xl">NF {item.nota}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-white text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md font-medium">
                  Pedido {item.pedido}
                </span>
                <span className="text-white text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md font-medium">
                  {item.volumes} volumes
                </span>
              </div>
            </div>
          </div>

          <span
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.text.replace('text-', 'border-')} self-start`}
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}></span>
            {item.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <InfoCard
            icon={<User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
            label="Cliente"
            value={item.cliente}
          />
          <InfoCard
            icon={<User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
            label="Solicitante"
            value={item.solicitante}
          />
          <InfoCard
            icon={<Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
            label="Transportadora"
            value={item.transportadora}
          />

          {item.tracking && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <Hash className="w-4 h-4 text-gray-600" />
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tracking</p>
              </div>
              <p className="text-gray-900 font-mono font-semibold text-sm sm:text-base break-all">{item.tracking}</p>
            </div>
          )}
        </div>

        {/* Destination */}
        {isValidValue(item.destino) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Destino</p>
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  {item.destino} {item.estado && `- ${item.estado}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <p className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Linha do Tempo</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DateInfo label="Data da Nota" value={formatDateBR(item.dataNota)} />
            <DateInfo label="Ocorrência" value={formatDateBR(item.dataOcorrencia)} />
            <DateInfo label="Última Atualização" value={formatDateBR(item.ultimaOcorrencia)} />
          </div>
        </div>

        {/* Detailed Status */}
        {(item.statusCliente || item.statusTransportadora) && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Status Detalhado</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <p className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Cliente</p>
                <p className="text-sm font-medium text-gray-900">{item.statusCliente || "-"}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <p className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Transportadora</p>
                <p className="text-sm font-medium text-gray-900">{item.statusTransportadora || "-"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Text Blocks */}
        {(item.ocorrencia || item.obs || item.pendencia) && (
          <div className="space-y-3">
            {item.ocorrencia && (
              <TextBlock
                title="Ocorrência"
                value={item.ocorrencia}
                icon={<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
              />
            )}
            {item.pendencia && (
              <TextBlock
                title="Pendência"
                value={item.pendencia}
                icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
              />
            )}
            {item.obs && (
              <TextBlock
                title="Observações"
                value={item.obs}
                icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
              />
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(item)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 sm:py-3 rounded-lg transition-colors duration-200 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md flex-1"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            Editar
          </button>
          <button
            onClick={() => item.id && onDelete(item.id)}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-4 py-2.5 sm:py-3 rounded-lg transition-colors duration-200 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md flex-1"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

/* Componentes auxiliares */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value?: string
}) {
  if (!value) return null

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-gray-900 font-semibold text-sm sm:text-base truncate">{value}</p>
        </div>
      </div>
    </div>
  )
}

function DateInfo({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="bg-white border border-blue-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
      <p className="text-xs font-semibold text-blue-600 mb-1.5 uppercase tracking-wide">{label}</p>
      <p className="text-gray-900 font-semibold text-xs sm:text-sm">{value}</p>
    </div>
  )
}

function TextBlock({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</p>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
    </div>
  )
}