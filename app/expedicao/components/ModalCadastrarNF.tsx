"use client";

import { CadastrationExpedicao } from "@/types/Expedicao";
import Modal from "./Modal";
import { FileText, User, Package, Save, Calendar } from "lucide-react";
import { useState } from "react";
import { DateInput } from "@/components/DateInput";
import { formatDateBR } from "@/lib/formatDate";
import { cadastroNFSchema, type CadastroNFData } from "../schemas/validations";

interface Props {
  onClose: () => void;
  onSave: (novo: CadastrationExpedicao) => void;
}

export default function ModalCadastrarNF({ onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    nota: "",
    cliente: "",
    dataNota: "",
    volumes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CadastroNFData, string>>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar com Zod
    const resultado = cadastroNFSchema.safeParse(formData);

    if (!resultado.success) {
      // Mapear erros do Zod
      const novoErros: Partial<Record<keyof CadastroNFData, string>> = {};
      resultado.error.issues.forEach((erro) => {
        const campo = erro.path[0] as keyof CadastroNFData;
        novoErros[campo] = erro.message;
      });
      setErrors(novoErros);
      return;
    }

    // Limpar erros e salvar
    setErrors({});
    const novo: CadastrationExpedicao = {
      id: crypto.randomUUID(),
      nota: resultado.data.nota,
      cliente: resultado.data.cliente,
      dataNota: formatDateBR(resultado.data.dataNota),
      volumes: resultado.data.volumes,
      status: "NF DISPONIVEIS",
    };

    onSave(novo);
    onClose();
  };

  return (
    <Modal title="Registrar Retira" subtitle="Cadastrar Nota Fiscal" onClose={onClose}>
      
      <form noValidate onSubmit={submit} className="space-y-5">
        {/* ALERTAS DE ERRO */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              ⚠️ Verifique os campos com erro abaixo
            </p>
          </div>
        )}

        {/* NÚMERO DA NF */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Número da NF *
          </label>
          <input
            required
            type="number"
            min={1}
            step={1}
            value={formData.nota}
            onChange={(e) => {
              setFormData({ ...formData, nota: e.target.value });
              if (errors.nota && e.target.value) {
                setErrors({ ...errors, nota: undefined });
              }
            }}
            placeholder="Ex: 123456"
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl
              text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 transition ${
              errors.nota
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 dark:border-gray-700 focus:ring-blue-500"
            }`}
          />
          {errors.nota && <p className="text-red-500 text-xs mt-1">{errors.nota}</p>}
        </div>

        {/* CLIENTE */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 text-blue-500" />
            Nome do Cliente *
          </label>
          <input
            required
            type="text"
            minLength={3}
            value={formData.cliente}
            onChange={(e) => {
              setFormData({ ...formData, cliente: e.target.value });
              if (errors.cliente && e.target.value.length >= 3) {
                setErrors({ ...errors, cliente: undefined });
              }
            }}
            placeholder="Ex: Empresa ABC Ltda"
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl
              text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 transition ${
              errors.cliente
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 dark:border-gray-700 focus:ring-blue-500"
            }`}
          />
          {errors.cliente && <p className="text-red-500 text-xs mt-1">{errors.cliente}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
          {/* VOLUMES */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Package className="w-4 h-4 text-blue-500" />
              Quantidade de Volumes
            </label>
            <input
              required
              type="number"
              min={1}
              step={1}
              value={formData.volumes}
              onChange={(e) => {
                setFormData({ ...formData, volumes: e.target.value });
                if (errors.volumes && e.target.value) {
                  setErrors({ ...errors, volumes: undefined });
                }
              }}
              placeholder="Ex: 10"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl
        text-gray-900 dark:text-white placeholder-gray-400
        focus:outline-none focus:ring-2 transition ${
        errors.volumes
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-200 dark:border-gray-700 focus:ring-blue-500"
      }`}
            />
            {errors.volumes && <p className="text-red-500 text-xs mt-1">{errors.volumes}</p>}
          </div>

          {/* DATA DA NOTA */}
          <div className="flex-1 flex flex-col">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Data da Nota
            </label>

            <div className={`${
              errors.dataNota ? "ring-2 ring-red-500 rounded-xl" : ""
            }`}>
              <DateInput
                name="dataNota"
                value={formData.dataNota}
                onChange={(e) => {
                  setFormData({ ...formData, dataNota: e.target.value });
                  if (errors.dataNota && e.target.value) {
                    setErrors({ ...errors, dataNota: undefined });
                  }
                }}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            {errors.dataNota && <p className="text-red-500 text-xs mt-1">{errors.dataNota}</p>}
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-600 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
              text-gray-700 dark:text-gray-300 font-bold rounded-xl transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700
              hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl
              shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition
              disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
          >
            <Save className="w-5 h-5" />
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
