"use client";

import { Package, Plus, X } from "lucide-react";
import { useState } from "react";

interface HeaderExpedicaoProps {
  onCadastrar: () => void;
}

export default function HeaderExpedicao({ onCadastrar }: HeaderExpedicaoProps) {
  return (
    <div className="sticky top-0 z-40">
      {/* HEADER PRINCIPAL */}
      <div className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800">
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

      {/* 🚧 BANNER DE AVISO */}
      <DevelopmentBanner />
    </div>
  );
}

function DevelopmentBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-amber-500 text-white text-sm font-semibold shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-4 py-2">
        <span>
          🚧 Sistema em desenvolvimento — algumas funções podem estar instáveis
        </span>

        <button
          onClick={() => setVisible(false)}
          className="ml-4 hover:bg-amber-600 rounded p-1 transition"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
