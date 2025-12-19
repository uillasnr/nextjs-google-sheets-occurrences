"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  X,
  FileText,
  Package,
  AlertCircle,
  Calendar,
  Users,
  MapPin,
  Activity,
  MessageSquare,
} from "lucide-react";
import type { Occurrence } from "@/types/occurrence";
import { TIPO_OCORRENCIA_MAP } from "@/types/occurrence";

interface OccurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (occurrence: Occurrence) => void;
  editingOccurrence?: Occurrence | null;
  sheet: "SP" | "PE" | "ES";
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
  status: "Em analise",
};

const ESTADOS_BRASILEIROS = [
  { value: "", label: "Selecione..." },
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export default function OccurrenceModal({
  isOpen,
  onClose,
  onSubmit,
  editingOccurrence,
  sheet,
}: OccurrenceModalProps) {
  const [form, setForm] = useState<Occurrence>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingOccurrence) {
      // Se está editando, recalcula o tracking baseado na data atual
      const updatedOccurrence = { ...editingOccurrence };
      if (editingOccurrence.dataOcorrencia) {
        const dias = calculateDaysSinceOccurrence(
          editingOccurrence.dataOcorrencia
        );
        updatedOccurrence.tracking =
          dias > 0 ? `${dias} ${dias === 1 ? "dia" : "dias"}` : "";
      }
      setForm(updatedOccurrence);
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingOccurrence, isOpen]);

  const calculateDaysSinceOccurrence = (dataOcorrencia: string): number => {
    if (!dataOcorrencia) return 0;

    const dataInicio = new Date(dataOcorrencia);
    const hoje = new Date();

    // Zera as horas para calcular apenas os dias completos
    dataInicio.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    const diferencaEmMs = hoje.getTime() - dataInicio.getTime();
    const diferencaEmDias = Math.floor(diferencaEmMs / (1000 * 60 * 60 * 24));

    return diferencaEmDias >= 0 ? diferencaEmDias : 0;
  };

  const updateField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    // Se a data da ocorrência foi alterada, recalcula o tracking automaticamente
    if (name === "dataOcorrencia") {
      const dias = calculateDaysSinceOccurrence(value);
      updatedForm.tracking =
        dias > 0 ? `${dias} ${dias === 1 ? "dia" : "dias"}` : "";
    }

    setForm(updatedForm);

    // Limpa erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validação Nota Fiscal (obrigatório)
    if (!form.nota.trim()) {
      newErrors.nota = "Nota fiscal é obrigatória";
    }

    // Validação Data da Nota (não pode ser futura)
    if (form.dataNota) {
      const dataNotaDate = new Date(form.dataNota);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (dataNotaDate > hoje) {
        newErrors.dataNota = "Data da nota não pode ser futura";
      }
    }

    // Validação Data da Ocorrência (não pode ser futura)
    if (form.dataOcorrencia) {
      const dataOcorrenciaDate = new Date(form.dataOcorrencia);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (dataOcorrenciaDate > hoje) {
        newErrors.dataOcorrencia = "Data da ocorrência não pode ser futura";
      }
    }

    // Validação Volumes (deve ser número positivo se preenchido)
    if (
      form.volumes &&
      (isNaN(Number(form.volumes)) || Number(form.volumes) <= 0)
    ) {
      newErrors.volumes = "Deve ser um número válido maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(form);
      setForm(emptyForm);
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card-dark rounded-2xl shadow-2xl flex flex-col max-w-4xl w-full max-h-[90vh] border border-card-border overflow-hidden">
      <div className=" relative bg-card-dark rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto border border-card-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-card-dark pb-4 border-b border-card-border z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary">
                {editingOccurrence ? "Editar Ocorrência" : "Nova Ocorrência"}
              </h3>
              <p className="text-sm text-text-secondary">Filial {sheet}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary hover:bg-input-bg rounded-lg p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Principais */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-primary" />
              Informações Principais
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Nota Fiscal <span className="text-status-error">*</span>
                </label>
                <input
                  name="nota"
                  value={form.nota}
                  onChange={updateField}
                  className={`bg-input-bg border ${
                    errors.nota ? "border-status-error" : "border-input-border"
                  } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder`}
                  placeholder="Digite o número da nota"
                />
                {errors.nota && (
                  <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.nota}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Volumes
                </label>
                <input
                  name="volumes"
                  type="number"
                  min="1"
                  value={form.volumes}
                  onChange={updateField}
                  className={`!bg-input-bg border ${
                    errors.volumes
                      ? "!border-status-error"
                      : "!border-input-border"
                  } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary appearance-none transition-all placeholder:text-input-placeholder`}
                  placeholder="Quantidade de volumes"
                />
                {errors.volumes && (
                  <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.volumes}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tipo de Ocorrência
                </label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
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
            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-primary" />
              Datas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Data da Nota
                </label>
                <input
                  type="date"
                  name="dataNota"
                  value={form.dataNota}
                  onChange={updateField}
                  max={new Date().toISOString().split("T")[0]}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all [color-scheme:dark]"
                />
                {errors.dataNota && (
                  <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.dataNota}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Data da Ocorrência
                </label>
                <input
                  type="date"
                  name="dataOcorrencia"
                  value={form.dataOcorrencia}
                  onChange={updateField}
                  max={new Date().toISOString().split("T")[0]}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all [color-scheme:dark]"
                />
                {errors.dataOcorrencia && (
                  <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.dataOcorrencia}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Última Ocorrência
                </label>
                <input
                  type="date"
                  name="ultimaOcorrencia"
                  value={form.ultimaOcorrencia}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Partes Envolvidas */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-primary" />
              Partes Envolvidas
            </h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Cliente
              </label>
              <input
                name="cliente"
                value={form.cliente}
                onChange={updateField}
                className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder"
                placeholder="Nome do cliente"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Transportadora
                </label>
                <input
                  name="transportadora"
                  value={form.transportadora}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder"
                  placeholder="Nome da transportadora"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Número do Pedido
                </label>
                <input
                  name="pedido"
                  value={form.pedido}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder"
                  placeholder="Número do pedido"
                />
              </div>
              <div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Quem e o responsavel pela análise da ocorrência
                  </label>
                  <textarea
                    name="pendencia"
                    value={form.pendencia}
                    onChange={updateField}
                    rows={1}
                    placeholder="Responsável"
                    className="bg-input-bg border resize-none auto-resize border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Solicitante
                </label>
                <input
                  name="solicitante"
                  value={form.solicitante}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder"
                  placeholder="Nome do solicitante"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-primary" />
              Localização
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Destino
                </label>
                <input
                  name="destino"
                  value={form.destino}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder"
                  placeholder="Cidade de destino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                >
                  {ESTADOS_BRASILEIROS.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status e Tracking */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-primary" />
              Status e Rastreamento
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Status Inicial
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                >
                  <option value="Em analise">Em análise</option>
                  <option value="Pendencia comercial">
                    Pendência comercial
                  </option>
                  <option value="Ocorrencia finalizada">
                    Ocorrência finalizada
                  </option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Status Cliente
                </label>
                <select
                  name="statusCliente"
                  value={form.statusCliente}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                >
                  <option value="">Selecione...</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Resolvido">Resolvido</option>
                  <option value="Falta de provas">Falta de provas</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Status Transportadora
                </label>
                <select
                  name="statusTransportadora"
                  value={form.statusTransportadora}
                  onChange={updateField}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                >
                  <option value="">Selecione...</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Resolvido">Resolvido</option>
                  <option value="Falta de provas">Falta de provas</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                  Tracking (Dias em Aberto)
                  <span className="text-xs text-text-secondary font-normal">
                    (Calculado automaticamente)
                  </span>
                </label>
                <div className="relative">
                  <input
                    name="tracking"
                    value={form.tracking}
                    readOnly
                    className="bg-input-bg/50 border border-input-border text-text-secondary rounded-lg p-3 w-full cursor-not-allowed placeholder:text-input-placeholder"
                    placeholder={
                      form.dataOcorrencia
                        ? "Calculando..."
                        : "Selecione a data da ocorrência"
                    }
                  />
                  {form.tracking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Activity className="w-5 h-5 text-brand-primary animate-pulse" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-text-tertiary mt-1">
                  O contador inicia na data da ocorrência e atualiza
                  automaticamente
                </p>
              </div>
            </div>
          </div>

          {/* Descrições */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-primary" />
              Descrições
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Descreva a ocorrência
                </label>
                <textarea
                  name="ocorrencia"
                  value={form.ocorrencia}
                  onChange={updateField}
                  rows={3}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all resize-none placeholder:text-input-placeholder"
                  placeholder="Qual e o motivo da ocorrência"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Observações
                </label>
                <textarea
                  name="obs"
                  value={form.obs}
                  onChange={updateField}
                  rows={3}
                  className="bg-input-bg border border-input-border text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all resize-none placeholder:text-input-placeholder"
                  placeholder="Observações adicionais"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-6 border-t border-card-border sticky bottom-0 bg-card-dark/60 backdrop-blur-md z-20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-input-border text-text-primary rounded-lg hover:bg-input-bg transition-all font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-background-dark rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {editingOccurrence ? (
                <>
                  <Activity className="w-5 h-5" />
                  Atualizar Ocorrência
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  Criar Ocorrência
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
