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
      status: "AGUARDANDO", // 🔥 AGORA VAI PARA AGUARDANDO
    });
  };

  return (
    <Modal title="Informar Dados para Retirada" onClose={onClose}>
      <div className="space-y-6">
        {/* CABEÇALHO */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <Truck className="w-6 h-6 text-amber-600" />
          <div>
            <p className="font-bold text-amber-700 dark:text-amber-400">
              Dados do Motorista para Retirada
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Essas informações ficarão salvas na nota
            </p>
          </div>
        </div>

        {/* DADOS DA NOTA */}
        <div className="p-4 border rounded-xl space-y-3 text-sm">
          <p className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" /> NF {item.nota}
          </p>
          <p className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> {item.cliente}
          </p>
          <p className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" /> {item.volumes} volumes
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" /> {item.dataNota}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-bold flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-blue-500" />
              Motorista
            </label>
            <input
              required
              value={motorista}
              onChange={(e) => setMotorista(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border dark:bg-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              required
              value={cpf}
              maxLength={14}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              placeholder="CPF"
              className="px-4 py-3 rounded-xl border dark:bg-gray-900"
            />
            <input
              required
              value={placa}
              maxLength={8}
              onChange={(e) => setPlaca(formatarPlaca(e.target.value))}
              placeholder="Placa"
              className="px-4 py-3 rounded-xl border dark:bg-gray-900 uppercase"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 border rounded-xl py-2">
              Cancelar
            </button>
            <button type="submit" className="flex-1 bg-amber-500 text-white rounded-xl py-2 font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
