"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Occurrence } from "@/types/occurrence"
import { TIPO_OCORRENCIA_MAP } from "@/types/occurrence"

interface OccurrenceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (occurrence: Occurrence) => void
  editingOccurrence?: Occurrence | null
}

const emptyForm: Occurrence = {
  nota: "",
  volumes: "",
  tipo: "",
  solicitante: "",
  dataNota: "",
  dataOcorrencia: "",
  transportadora: "",
  cliente: "",
  destino: "",
  estado: "",
  pedido: "",
  ocorrencia: "",
  ultimaOcorrencia: "",
  statusCliente: "",
  statusTransportadora: "",
  tracking: "",
  obs: "",
  pendencia: "",
  status: "Pendente",
}

export default function OccurrenceModal({ isOpen, onClose, onSubmit, editingOccurrence }: OccurrenceModalProps) {
  const [form, setForm] = useState<Occurrence>(emptyForm)

  useEffect(() => {
    if (editingOccurrence) {
      setForm(editingOccurrence)
    } else {
      setForm(emptyForm)
    }
  }, [editingOccurrence, isOpen])

  const updateField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    setForm(emptyForm)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-white pb-3 border-b-2 border-blue-200">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
            {editingOccurrence ? "Editar Ocorrência" : "Nova Ocorrência"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Informações Principais */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              Informações Principais
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nota Fiscal *</label>
                <input
                  name="nota"
                  value={form.nota}
                  onChange={updateField}
                  required
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Volumes</label>
                <input
                  name="volumes"
                  value={form.volumes}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de Ocorrência</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Selecione...</option>
                  {Object.entries(TIPO_OCORRENCIA_MAP).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              Datas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Data da Nota</label>
                <input
                  type="date"
                  name="dataNota"
                  value={form.dataNota}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Data da Ocorrência</label>
                <input
                  type="date"
                  name="dataOcorrencia"
                  value={form.dataOcorrencia}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Última Ocorrência</label>
                <input
                  type="date"
                  name="ultimaOcorrencia"
                  value={form.ultimaOcorrencia}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Partes Envolvidas */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              Partes Envolvidas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cliente</label>
                <input
                  name="cliente"
                  value={form.cliente}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Transportadora</label>
                <input
                  name="transportadora"
                  value={form.transportadora}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Solicitante</label>
                <input
                  name="solicitante"
                  value={form.solicitante}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pedido</label>
                <input
                  name="pedido"
                  value={form.pedido}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              Localização
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Destino</label>
                <input
                  name="destino"
                  value={form.destino}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estado</label>
                <input
                  name="estado"
                  value={form.estado}
                  onChange={updateField}
                  placeholder="UF"
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Status e Tracking */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              Status e Rastreamento
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Resolvido">Resolvido</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status Cliente</label>
                <input
                  name="statusCliente"
                  value={form.statusCliente}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status Transportadora</label>
                <input
                  name="statusTransportadora"
                  value={form.statusTransportadora}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tracking</label>
                <input
                  name="tracking"
                  value={form.tracking}
                  onChange={updateField}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Descrições */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              Descrições
            </h4>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ocorrência</label>
                <textarea
                  name="ocorrencia"
                  value={form.ocorrencia}
                  onChange={updateField}
                  rows={3}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pendência</label>
                <textarea
                  name="pendencia"
                  value={form.pendencia}
                  onChange={updateField}
                  rows={2}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Observações</label>
                <textarea
                  name="obs"
                  value={form.obs}
                  onChange={updateField}
                  rows={2}
                  className="border-2 border-slate-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t-2 border-slate-200 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-all font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              {editingOccurrence ? "Atualizar" : "Criar"} Ocorrência
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
