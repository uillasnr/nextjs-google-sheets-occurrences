"use client";

import { CadastrationExpedicao } from "@/types/Expedicao";
import Modal from "./Modal";
import { FileText, User, Package, Save, Calendar } from "lucide-react";
import { useState } from "react";
import { DateInput } from "@/components/DateInput";

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const novo: CadastrationExpedicao = {
      id: crypto.randomUUID(),
      nota: Number(formData.nota),
      cliente: formData.cliente,
      dataNota: formData.dataNota, // TODO: adicionar campo de data da nota
      volumes: Number(formData.volumes),
      status: "PENDENTE",
    };

    onSave(novo);
    onClose();
  };

  return (
    <Modal title="Cadastrar Nota Fiscal" onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
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
            onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
            placeholder="Ex: 123456"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl
              text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
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
            pattern=".*\S.*"
            title="Informe um nome válido (mínimo 3 caracteres)"
            value={formData.cliente}
            onChange={(e) =>
              setFormData({ ...formData, cliente: e.target.value })
            }
            placeholder="Ex: Empresa ABC Ltda"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl
              text-gray-900 dark:text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
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
      onChange={(e) =>
        setFormData({ ...formData, volumes: e.target.value })
      }
      placeholder="Ex: 10"
      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl
        text-gray-900 dark:text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>

  {/* DATA DA NOTA */}
<div className="flex-1 flex flex-col">
  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ">
    <Calendar className="w-4 h-4 text-blue-500" />
    Data da Nota
  </label>

  <DateInput
    name="dataNota"
    value={formData.dataNota}
    onChange={(e) =>
      setFormData({ ...formData, dataNota: e.target.value })
    }
  
    max={new Date().toISOString().split("T")[0]}
  />
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
              shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition"
          >
            <Save className="w-5 h-5" />
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
