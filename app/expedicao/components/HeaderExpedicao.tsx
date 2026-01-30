"use client";

import { Package, Plus } from "lucide-react";

interface HeaderExpedicaoProps {
  onCadastrar: () => void;
}

export default function HeaderExpedicao({
  onCadastrar,
}: HeaderExpedicaoProps) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-2xl">
            <Package className="text-white w-7 h-7" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-gray-600 dark:text-white">
              Controle de Retira
            </h1>
            <p className="text-sm text-gray-500">
              Expedição de mercadorias
            </p>
          </div>
        </div>

        <button
          onClick={onCadastrar}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
        >
          <Plus size={20} />
          Registrar Retira
        </button>
      </div>
    </div>
  );
}
