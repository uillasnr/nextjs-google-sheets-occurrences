"use client";

import Modal from "./Modal";
import {
  Truck,
  User,
  CreditCard,
  Car,
  CheckCircle2,
  Package,
  Hash,
  Calendar,
  FileText,
  DeleteIcon,
} from "lucide-react";
import { useState } from "react";
import { Expedicao } from "@/types/Expedicao";

export default function ModalExpedir({
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

    onConfirm({
      ...item,
      motorista,
      cpf,
      placa,
      status: "EXPEDIDO",
    });

    onClose();
  };

  return (
    <Modal title="Confirmar Expedição" onClose={onClose}>
      <div className="space-y-6">
        {/* STATUS */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <Truck className="w-6 h-6 text-emerald-600" />
          <div>
            <p className="font-bold text-emerald-700 dark:text-emerald-400">
              Pronto para expedir
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              Confirme os dados do motorista
            </p>
          </div>
        </div>

        {/* DADOS DA CARGA */}
      {/* DADOS DA CARGA */}
<div className="space-y-4">
  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
    Dados da Carga
  </h3>

  <div
    className="p-4  border-2 border-gray-200 dark:border-gray-700
               rounded-xl space-y-4"
  >
    {/* LINHA 1 */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white mb-1">
          <FileText className="w-4 h-4 text-blue-500" />
          Número da NF
        </div>
        <p className="text-sm font-semibold  text-gray-600 dark:text-gray-400">
          NF: {item.nota}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white mb-1">
          <Package className="w-4 h-4 text-blue-500" />
          Volumes
        </div>
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
          {item.volumes}
        </p>
      </div>

       {/* CLIENTE */}
    <div>
      <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white mb-1">
        <User className="w-4 h-4 text-blue-500" />
        Cliente
      </div>
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
        {item.cliente}
      </p>
    </div>

 <div>
      <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white mb-1">
        <Calendar className="w-4 h-4 text-blue-500" />
        Data da Nota
      </div>
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
        {item.dataNota}
      </p>
    </div>
  
  </div>
</div>
    </div>

   

        {/* FORM */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 font-bold flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-blue-500" />
              Motorista
            </label>
            <input
              required
              value={motorista}
              onChange={(e) => setMotorista(e.target.value)}
              placeholder="Nome completo"
              className="w-full px-4 py-3 text-gray-700 dark:text-gray-300  rounded-xl border border-gray-600 bg-gray-50 dark:bg-gray-900   focus:outline-none focus:ring-2 focus:ring-blue-500 transition outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-bold flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-blue-500" />
                CPF
              </label>
              <input
                required
                value={cpf}
                maxLength={14}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                placeholder="000.000.000-00"
                className="w-full px-4 py-3 text-gray-700 dark:text-gray-300  rounded-xl border border-gray-600 dark:bg-gray-900   focus:outline-none focus:ring-2 focus:ring-blue-500 transition outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-bold flex items-center gap-2 mb-1">
                <Car className="w-4 h-4 text-blue-500" />
                Placa
              </label>
              <input
                required
                value={placa}
                maxLength={8}
                onChange={(e) => setPlaca(formatarPlaca(e.target.value))}
                placeholder="ABC-1234"
                className="w-full px-4 py-3 text-gray-700 dark:text-gray-300  rounded-xl border
                 border-gray-600 bg-gray-50 dark:bg-gray-900 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition outline-none uppercase"
              />
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
             className="flex-1 px-4 text-sm border border-gray-600 dark:border-gray-600
              bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
              text-gray-700 dark:text-gray-300 font-bold rounded-xl transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 px-4  text-white text-sm py-2
               bg-gradient-to-r from-blue-600 to-blue-700
              hover:from-blue-700 hover:to-blue-800  font-bold rounded-xl
              shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirmar Expedição
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
