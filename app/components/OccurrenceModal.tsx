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
import { TextInput } from "@/components/TextInput";
import { SelectInput } from "@/components/SelectInput";
import { TextAreaInput } from "@/components/TextAreaInput";
import { DateInput } from "@/components/DateInput";

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

  const toDateInputValue = (date?: string): string => {
    if (!date) return "";

    // Já está no formato correto
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // ISO completo (2024-01-10T03:00:00.000Z)
    if (date.includes("T")) {
      return date.split("T")[0];
    }

    // Formato brasileiro DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split("/");
      return `${year}-${month}-${day}`;
    }

    // Tentativa genérica (Date.parse)
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }

    return "";
  };

  useEffect(() => {
    if (editingOccurrence) {
      const updatedOccurrence = { ...editingOccurrence };

      // Estado (nome → sigla)
      if (editingOccurrence.estado) {
        updatedOccurrence.estado =
          ESTADO_NOME_PARA_SIGLA[editingOccurrence.estado] ||
          editingOccurrence.estado;
      }

      // 🔥 CORREÇÃO DAS DATAS
      updatedOccurrence.dataNota = toDateInputValue(editingOccurrence.dataNota);
      updatedOccurrence.dataOcorrencia = toDateInputValue(
        editingOccurrence.dataOcorrencia
      );
      updatedOccurrence.ultimaOcorrencia = toDateInputValue(
        editingOccurrence.ultimaOcorrencia
      );

      // Tracking
      if (updatedOccurrence.dataOcorrencia) {
        const dias = calculateDaysSinceOccurrence(
          updatedOccurrence.dataOcorrencia
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
      newErrors.solicitante =
        "Nome do solicitante deve ter pelo menos 3 caracteres";
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
          newErrors.dataOcorrencia =
            "Data da ocorrência não pode ser anterior à data da nota";
        }
      }
    }

    // Transportadora (obrigatório)
    if (!form.transportadora.trim()) {
      newErrors.transportadora = "Transportadora é obrigatória";
    } else if (form.transportadora.trim().length < 3) {
      newErrors.transportadora =
        "Nome da transportadora deve ter pelo menos 3 caracteres";
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

    const trackingNumero = Number(String(form.tracking).match(/\d+/)?.[0] || 0);

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
      tracking: trackingNumero > 0 ? `${trackingNumero}` : "",
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
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-w-4xl w-full max-h-[90vh] border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="relative p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editingOccurrence ? "Editar Ocorrência" : "Nova Ocorrência"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Filial {sheet}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-lg p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Principais */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />{" "}
                Informações Principais
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <TextInput
                    label="Nota Fiscal"
                    name="nota"
                    type="number"
                    value={form.nota}
                    onChange={updateField}
                    error={errors.nota}
                    required
                    placeholder="Digite o número da nota"
                  />
                </div>

                <div>
                  <TextInput
                    label="Volumes"
                    name="volumes"
                    type="number"
                    min={1}
                    value={form.volumes}
                    onChange={updateField}
                    error={errors.volumes}
                    required
                    placeholder="Quantidade de volumes"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <SelectInput
                    label="Tipo de Ocorrência"
                    name="tipo"
                    value={form.tipo}
                    onChange={updateField}
                    error={errors.tipo}
                    required
                    options={Object.entries(TIPO_OCORRENCIA_MAP).map(
                      ([_, value]) => ({
                        label: value,
                        value,
                      })
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Datas */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Datas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <DateInput
                    label="Data da Nota"
                    name="dataNota"
                    value={form.dataNota}
                    onChange={updateField}
                    error={errors.dataNota}
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <DateInput
                    label="Data da Ocorrência"
                    name="dataOcorrencia"
                    value={form.dataOcorrencia}
                    onChange={updateField}
                    error={errors.dataOcorrencia}
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <DateInput
                    label="Última Ocorrência"
                    name="ultimaOcorrencia"
                    value={form.ultimaOcorrencia}
                    onChange={updateField}
                    error={errors.ultimaOcorrencia}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            {/* Partes Envolvidas */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Partes Envolvidas
              </h4>
              <div className="mb-4">
                <TextInput
                  label="Cliente"
                  name="cliente"
                  min={1}
                  value={form.cliente}
                  onChange={updateField}
                  error={errors.cliente}
                  required
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <TextInput
                    label="Transportadora"
                    name="transportadora"
                    min={1}
                    value={form.transportadora}
                    onChange={updateField}
                    error={errors.cliente}
                    required
                    placeholder="Nome da transportadora"
                  />
                </div>

                <div>
                  <TextInput
                    label="Número do Pedido"
                    name="pedido"
                    type="number"
                    min={1}
                    value={form.pedido}
                    onChange={updateField}
                    error={errors.pedido}
                    required
                    placeholder="Número do pedido"
                  />
                </div>

                <div>
                  <TextInput
                    label="Responsável pela análise"
                    name="pendencia"
                    min={1}
                    value={form.pendencia}
                    onChange={updateField}
                    error={errors.pendencia}
                    required
                    placeholder="Nome do responsável"
                  />
                </div>

                <div>
                  <TextInput
                    label="Solicitante"
                    name="solicitante"
                    min={1}
                    value={form.solicitante}
                    onChange={updateField}
                    error={errors.solicitante}
                    required
                    placeholder="Nome do solicitante"
                  />
                </div>
              </div>
            </div>

            {/* Localização */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Localização
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <TextInput
                    label="Destino"
                    name="destino"
                    min={1}
                    value={form.destino}
                    onChange={updateField}
                    error={errors.destino}
                    required
                    placeholder="Cidade de destino"
                  />
                </div>

                <div>
                  <SelectInput
                    label="Estado"
                    name="estado"
                    value={form.estado}
                    onChange={updateField}
                    error={errors.estado}
                    required
                    options={Object.entries(ESTADO_SIGLA_PARA_NOME).map(
                      ([sigla, nome]) => ({
                        label: nome,
                        value: sigla,
                      })
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Status e Tracking */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Status e Rastreamento
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <SelectInput
                    label="Status Cliente"
                    name="statusCliente"
                    value={form.statusCliente}
                    onChange={updateField}
                    error={errors.statusCliente}
                    required
                    options={[
                      { label: "Pendente", value: "EM ABERTO" },
                      { label: "Resolvido", value: "RESOLVIDO" },
                      { label: "Falta de provas", value: "Falta de provas" },
                    ]}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <SelectInput
                    label="Status Transportadora"
                    name="statusTransportadora"
                    value={form.statusTransportadora}
                    onChange={updateField}
                    error={errors.statusTransportadora}
                    required
                    options={[
                      { label: "Pendente", value: "EM ABERTO" },
                      { label: "Resolvido", value: "RESOLVIDO" },
                      { label: "Falta de provas", value: "Falta de provas" },
                    ]}
                  />
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
                      className="bg-gray-200 dark:bg-gray-900 border border-i border-gray-300 dark:border-gray-600 text-text-secondary rounded-lg p-3 w-full cursor-not-allowed placeholder:text-input-placeholder"
                      placeholder={
                        form.dataOcorrencia
                          ? "Calculando..."
                          : "Selecione a data da ocorrência"
                      }
                    />
                    {form.tracking && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Descrições
              </h4>
              <div className="space-y-4">
                <div>
                  <TextAreaInput
                    label="Descreva a ocorrência"
                    name="ocorrencia"
                    value={form.ocorrencia}
                    onChange={updateField}
                    error={errors.ocorrencia}
                    required
                    placeholder="Qual é o motivo da ocorrência (mínimo 10 caracteres)"
                  />
                </div>

                <div>
                  <TextAreaInput
                    label="Observações"
                    name="obs"
                    value={form.obs}
                    onChange={updateField}
                    error={errors.obs}
                    required
                    placeholder="Observações adicionais (opcional)"
                  />
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
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-6  sticky bottom-0 bg-gray-200 dark:bg-gray-800/60 backdrop-blur-md z-20">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-600 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white  rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
