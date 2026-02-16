"use client";

import Modal from "./Modal";
import {
  Truck,
  User,
  CreditCard,
  Car,
  CheckCircle2,
  Package,
  Calendar,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { Expedicao } from "@/types/Expedicao";
import { aguardarSchema, type AguardarData } from "../schemas/validations";
import { formatDateBR } from "@/lib/formatDate";

export default function ModalAguardar({
  item,
  onClose,
  onConfirm,
}: {
  item: Expedicao;
  onClose: () => void;
  onConfirm: (atualizado: Expedicao) => void;
}) {
  const [motorista, setMotorista] = useState("");
  const [cpf, setCpf] = useState("");
  const [placa, setPlaca] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof AguardarData, string>>>({});

  const formatarCPF = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);

  const formatarPlaca = (v: string) =>
    v
      .replace(/[^A-Z0-9]/gi, "")
      .toUpperCase()
      .replace(/^([A-Z]{3})([0-9])/, "$1-$2")
      .slice(0, 8);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar com Zod
    const resultado = aguardarSchema.safeParse({
      motorista,
      cpf,
      placa,
    });

    if (!resultado.success) {
      // Mapear erros do Zod
      const novoErros: Partial<Record<keyof AguardarData, string>> = {};
      resultado.error.issues.forEach((erro) => {
        const campo = erro.path[0] as keyof AguardarData;
        novoErros[campo] = erro.message;
      });
      setErrors(novoErros);
      return;
    }

    // Limpar erros e confirmar
    setErrors({});
    onConfirm({
      ...item,
      motorista: resultado.data.motorista,
      cpf: resultado.data.cpf,
      placa: resultado.data.placa,
      status: "AGUARDANDO",
    });
  };

  return (
    <Modal title="Informar Dados para Retirada" subtitle="" onClose={onClose}>
      <form noValidate onSubmit={submit} className="space-y-5">
        {/* ALERTAS DE ERRO */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              ⚠️ Verifique os campos com erro abaixo
            </p>
          </div>
        )}

        {/* CABEÇALHO */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <Truck className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-bold text-blue-700 dark:text-blue-400">
              Dados do Motorista para Retirada
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              Essas informações ficarão salvas na nota
            </p>
          </div>
        </div>

        {/* DADOS DA NOTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2  items-center p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl space-y-1 text-sm">
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4 text-blue-500" /> NF {item.nota}
          </p>
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <User className="w-4 h-4 text-blue-500" /> {item.cliente}
          </p>
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Package className="w-4 h-4 text-blue-500" /> {item.volumes} volumes
          </p>
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 text-blue-500" />{formatDateBR(item.dataNota)}
          </p>
        </div>

        {/* MOTORISTA */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 text-blue-500" />
            Motorista *
          </label>
          <input
            value={motorista}
            onChange={(e) => {
              setMotorista(e.target.value);
              if (errors.motorista && e.target.value.trim().length >= 3) {
                setErrors({ ...errors, motorista: undefined });
              }
            }}
            placeholder="Ex: João Silva"
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl
              text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 transition ${
              errors.motorista
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 dark:border-gray-700 focus:ring-blue-500"
            }`}
          />
          {errors.motorista && (
            <p className="text-red-500 text-xs mt-1">{errors.motorista}</p>
          )}
        </div>

        {/* CPF E PLACA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              CPF *
            </label>
            <input
              value={cpf}
              maxLength={14}
              onChange={(e) => {
                setCpf(formatarCPF(e.target.value));
                if (
                  errors.cpf &&
                  formatarCPF(e.target.value).replace(/\D/g, "").length >= 11
                ) {
                  setErrors({ ...errors, cpf: undefined });
                }
              }}
              placeholder="Ex: 123.456.789-00"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl
                text-gray-900 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 transition ${
                errors.cpf
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:ring-blue-500"
              }`}
            />
            {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Car className="w-4 h-4 text-blue-500" />
              Placa *
            </label>
            <input
              value={placa}
              maxLength={8}
              onChange={(e) => {
                setPlaca(formatarPlaca(e.target.value));
                if (
                  errors.placa &&
                  formatarPlaca(e.target.value).replace(/[^A-Z0-9]/gi, "")
                    .length >= 7
                ) {
                  setErrors({ ...errors, placa: undefined });
                }
              }}
              placeholder="Ex: ABC-1234"
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl
                text-gray-900 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 transition uppercase ${
                errors.placa
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 dark:border-gray-700 focus:ring-blue-500"
              }`}
            />
            {errors.placa && <p className="text-red-500 text-xs mt-1">{errors.placa}</p>}
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
            <CheckCircle2 className="w-5 h-5" />
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
}
