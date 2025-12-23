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

const ESTADO_SIGLA_PARA_NOME: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

export default function OccurrenceModal({
  isOpen,
  onClose,
  onSubmit,
  editingOccurrence,
  sheet,
}: OccurrenceModalProps) {
  const [form, setForm] = useState<Occurrence>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ESTADO_NOME_PARA_SIGLA: Record<string, string> = Object.fromEntries(
    Object.entries(ESTADO_SIGLA_PARA_NOME).map(([sigla, nome]) => [nome, sigla])
  );

  useEffect(() => {
    if (editingOccurrence) {
      const updatedOccurrence = { ...editingOccurrence };

      // Converte nome do estado para sigla
      if (editingOccurrence.estado) {
        updatedOccurrence.estado =
          ESTADO_NOME_PARA_SIGLA[editingOccurrence.estado] ||
          editingOccurrence.estado;
      }

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

    // Se a data da ocorrência foi alterada, recalcula o tracking
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

    // ===== VALIDAÇÕES OBRIGATÓRIAS =====
    
    // Nota Fiscal (obrigatório)
    if (!form.nota.trim()) {
      newErrors.nota = "Nota fiscal é obrigatória";
    } else if (form.nota.trim().length < 3) {
      newErrors.nota = "Nota fiscal deve ter pelo menos 3 caracteres";
    }

    // Volumes (obrigatório e deve ser número positivo)
    if (!form.volumes) {
      newErrors.volumes = "Volumes é obrigatório";
    } else if (isNaN(Number(form.volumes)) || Number(form.volumes) <= 0) {
      newErrors.volumes = "Deve ser um número válido maior que zero";
    }

    // Tipo de Ocorrência (obrigatório)
    if (!form.tipo || form.tipo.trim() === "") {
      newErrors.tipo = "Tipo de ocorrência é obrigatório";
    }

    // Solicitante (obrigatório)
    if (!form.solicitante.trim()) {
      newErrors.solicitante = "Solicitante é obrigatório";
    } else if (form.solicitante.trim().length < 3) {
      newErrors.solicitante = "Nome do solicitante deve ter pelo menos 3 caracteres";
    }

    // Data da Nota (obrigatório e não pode ser futura)
    if (!form.dataNota) {
      newErrors.dataNota = "Data da nota é obrigatória";
    } else {
      const dataNotaDate = new Date(form.dataNota);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (dataNotaDate > hoje) {
        newErrors.dataNota = "Data da nota não pode ser futura";
      }
    }

    // Data da Ocorrência (obrigatório e não pode ser futura)
    if (!form.dataOcorrencia) {
      newErrors.dataOcorrencia = "Data da ocorrência é obrigatória";
    } else {
      const dataOcorrenciaDate = new Date(form.dataOcorrencia);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (dataOcorrenciaDate > hoje) {
        newErrors.dataOcorrencia = "Data da ocorrência não pode ser futura";
      }
      
      // Validar se data da ocorrência não é anterior à data da nota
      if (form.dataNota) {
        const dataNotaDate = new Date(form.dataNota);
        if (dataOcorrenciaDate < dataNotaDate) {
          newErrors.dataOcorrencia = "Data da ocorrência não pode ser anterior à data da nota";
        }
      }
    }

    // Transportadora (obrigatório)
    if (!form.transportadora.trim()) {
      newErrors.transportadora = "Transportadora é obrigatória";
    } else if (form.transportadora.trim().length < 3) {
      newErrors.transportadora = "Nome da transportadora deve ter pelo menos 3 caracteres";
    }

    // Cliente (obrigatório)
    if (!form.cliente.trim()) {
      newErrors.cliente = "Cliente é obrigatório";
    } else if (form.cliente.trim().length < 3) {
      newErrors.cliente = "Nome do cliente deve ter pelo menos 3 caracteres";
    }

    // Destino (obrigatório)
    if (!form.destino.trim()) {
      newErrors.destino = "Destino é obrigatório";
    } else if (form.destino.trim().length < 3) {
      newErrors.destino = "Destino deve ter pelo menos 3 caracteres";
    }

    // Estado (obrigatório)
    if (!form.estado || form.estado.trim() === "") {
      newErrors.estado = "Estado é obrigatório";
    }

    // Número do Pedido (obrigatório)
    if (!form.pedido.trim()) {
      newErrors.pedido = "Número do pedido é obrigatório";
    }

    // Descrição da Ocorrência (obrigatório)
    if (!form.ocorrencia.trim()) {
      newErrors.ocorrencia = "Descrição da ocorrência é obrigatória";
    } else if (form.ocorrencia.trim().length < 10) {
      newErrors.ocorrencia = "Descrição deve ter pelo menos 10 caracteres";
    }

    // Responsável pela análise (obrigatório)
    if (!form.pendencia.trim()) {
      newErrors.pendencia = "Responsável pela análise é obrigatório";
    }

    // Status Cliente (obrigatório)
    if (!form.statusCliente || form.statusCliente.trim() === "") {
      newErrors.statusCliente = "Status do cliente é obrigatório";
    }

    // Status Transportadora (obrigatório)
    if (!form.statusTransportadora || form.statusTransportadora.trim() === "") {
      newErrors.statusTransportadora = "Status da transportadora é obrigatório";
    }

    // ===== VALIDAÇÕES OPCIONAIS (SE PREENCHIDAS) =====

    // Última Ocorrência (se preenchida, não pode ser futura)
    if (form.ultimaOcorrencia) {
      const ultimaOcorrenciaDate = new Date(form.ultimaOcorrencia);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (ultimaOcorrenciaDate > hoje) {
        newErrors.ultimaOcorrencia = "Última ocorrência não pode ser futura";
      }
    }

    // Observações (se preenchidas, validar tamanho mínimo)
    if (form.obs.trim() && form.obs.trim().length < 5) {
      newErrors.obs = "Observações devem ter pelo menos 5 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll para o primeiro erro
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    const estadoNome = ESTADO_SIGLA_PARA_NOME[form.estado] || form.estado;

    // Regra da coluna T (Status do Excel)
    const statusExcelValue =
      ["RESOLVIDO", "FALTA DE PROVAS"].includes(
        form.statusCliente?.toUpperCase()
      ) &&
      ["RESOLVIDO", "FALTA DE PROVAS"].includes(
        form.statusTransportadora?.toUpperCase()
      )
        ? "OK"
        : "";

    onSubmit({
      ...form,
      estado: estadoNome,
      status: statusExcelValue,
    });

    setForm(emptyForm);
    setErrors({});
    onClose();
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
        <div className="relative bg-card-dark rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto border border-card-border">
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
                    Volumes <span className="text-status-error">*</span>
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
                    Tipo de Ocorrência <span className="text-status-error">*</span>
                  </label>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={updateField}
                    className={`bg-input-bg border ${
                      errors.tipo ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all`}
                  >
                    <option value="">Selecione...</option>
                    {Object.entries(TIPO_OCORRENCIA_MAP).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  {errors.tipo && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.tipo}
                    </p>
                  )}
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
                    Data da Nota <span className="text-status-error">*</span>
                  </label>
                  <input
                    type="date"
                    name="dataNota"
                    value={form.dataNota}
                    onChange={updateField}
                    max={new Date().toISOString().split("T")[0]}
                    className={`bg-input-bg border ${
                      errors.dataNota ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all [color-scheme:dark]`}
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
                    Data da Ocorrência <span className="text-status-error">*</span>
                  </label>
                  <input
                    type="date"
                    name="dataOcorrencia"
                    value={form.dataOcorrencia}
                    onChange={updateField}
                    max={new Date().toISOString().split("T")[0]}
                    className={`bg-input-bg border ${
                      errors.dataOcorrencia ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all [color-scheme:dark]`}
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
                    max={new Date().toISOString().split("T")[0]}
                    className={`bg-input-bg border ${
                      errors.ultimaOcorrencia ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all [color-scheme:dark]`}
                  />
                  {errors.ultimaOcorrencia && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.ultimaOcorrencia}
                    </p>
                  )}
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
                  Cliente <span className="text-status-error">*</span>
                </label>
                <input
                  name="cliente"
                  value={form.cliente}
                  onChange={updateField}
                  className={`bg-input-bg border ${
                    errors.cliente ? "border-status-error" : "border-input-border"
                  } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder`}
                  placeholder="Nome do cliente"
                />
                {errors.cliente && (
                  <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.cliente}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Transportadora <span className="text-status-error">*</span>
                  </label>
                  <input
                    name="transportadora"
                    value={form.transportadora}
                    onChange={updateField}
                    className={`bg-input-bg border ${
                      errors.transportadora ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder`}
                    placeholder="Nome da transportadora"
                  />
                  {errors.transportadora && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.transportadora}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Número do Pedido <span className="text-status-error">*</span>
                  </label>
                  <input
                    name="pedido"
                    value={form.pedido}
                    onChange={updateField}
                    className={`bg-input-bg border ${
                      errors.pedido ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder`}
                    placeholder="Número do pedido"
                  />
                  {errors.pedido && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.pedido}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Responsável pela análise <span className="text-status-error">*</span>
                  </label>
                  <textarea
                    name="pendencia"
                    value={form.pendencia}
                    onChange={updateField}
                    rows={1}
                    placeholder="Nome do responsável"
                    className={`bg-input-bg border resize-none ${
                      errors.pendencia ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder`}
                  />
                  {errors.pendencia && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.pendencia}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Solicitante <span className="text-status-error">*</span>
                  </label>
                  <input
                    name="solicitante"
                    value={form.solicitante}
                    onChange={updateField}
                    className={`bg-input-bg border ${
                      errors.solicitante ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder`}
                    placeholder="Nome do solicitante"
                  />
                  {errors.solicitante && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.solicitante}
                    </p>
                  )}
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
                    Destino <span className="text-status-error">*</span>
                  </label>
                  <input
                    name="destino"
                    value={form.destino}
                    onChange={updateField}
                    className={`bg-input-bg border ${
                      errors.destino ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder:text-input-placeholder`}
                    placeholder="Cidade de destino"
                  />
                  {errors.destino && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.destino}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Estado <span className="text-status-error">*</span>
                  </label>
                  <select
                    name="estado"
                    value={form.estado}
                    onChange={updateField}
                    className={`bg-input-bg border ${
                      errors.estado ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all`}
                  >
                    <option value="">Selecione...</option>
                    {Object.entries(ESTADO_SIGLA_PARA_NOME).map(([sigla, nome]) => (
                      <option key={sigla} value={sigla}>
                        {nome}
                      </option>
                    ))}
                  </select>
                  {errors.estado && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.estado}
                    </p>
                  )}
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
                    Status Cliente <span className="text-status-error">*</span>
                  </label>
                  <select
                    name="statusCliente"
                    value={form.statusCliente}
                    onChange={updateField}
                    className={`bg-input-bg border ${
                      errors.statusCliente ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all`}
                  >
                    <option value="">Selecione...</option>
                    <option value="EM ABERTO">Pendente</option>
                    <option value="RESOLVIDO">Resolvido</option>
                    <option value="Falta de provas">Falta de provas</option>
                  </select>
                  {errors.statusCliente && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.statusCliente}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Status Transportadora <span className="text-status-error">*</span>
                  </label>
                  <select
                    name="statusTransportadora"
                    value={form.statusTransportadora}
                    onChange={updateField}
                    className={`bg-input-bg border ${
                      errors.statusTransportadora ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all`}
                  >
                    <option value="">Selecione...</option>
                    <option value="EM ABERTO">Pendente</option>
                    <option value="RESOLVIDO">Resolvido</option>
                    <option value="Falta de provas">Falta de provas</option>
                  </select>
                  {errors.statusTransportadora && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.statusTransportadora}
                    </p>
                  )}
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
                    O contador inicia na data da ocorrência e atualiza automaticamente
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
                    Descreva a ocorrência <span className="text-status-error">*</span>
                  </label>
                  <textarea
                    name="ocorrencia"
                    value={form.ocorrencia}
                    onChange={updateField}
                    rows={3}
                    className={`bg-input-bg border ${
                      errors.ocorrencia ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all resize-none placeholder:text-input-placeholder`}
                    placeholder="Qual é o motivo da ocorrência (mínimo 10 caracteres)"
                  />
                  {errors.ocorrencia && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.ocorrencia}
                    </p>
                  )}
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
                    className={`bg-input-bg border ${
                      errors.obs ? "border-status-error" : "border-input-border"
                    } text-text-primary rounded-lg p-3 w-full focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all resize-none placeholder:text-input-placeholder`}
                    placeholder="Observações adicionais (opcional)"
                  />
                  {errors.obs && (
                    <p className="text-status-error text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.obs}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Resumo de Erros */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-status-error/10 border border-status-error rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-status-error mb-2">
                      Corrija os seguintes erros:
                    </h5>
                    <ul className="text-sm text-status-error space-y-1 list-disc list-inside">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

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