"use client";

import { Plus, LayoutGrid, Building2 } from "lucide-react";

type Props = {
  sheet: "SP" | "PE" | "ES" | "Fábrica" | "Tocantins_SP";
  setSheet: (value: Props["sheet"]) => void;
  onNew: () => void;
};

export default function HeaderCadastro({ sheet, setSheet, onNew }: Props) {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 flex-wrap">
          {/* 🔷 LADO ESQUERDO */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 sm:p-3 rounded-2xl shadow-lg border border-blue-500/20 flex-shrink-0">
              <LayoutGrid className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight truncate">
                Armazém 48
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                Cadastro e gestão de produtos do Armazém 48
              </p>
            </div>
          </div>

          {/* 🔷 LADO DIREITO */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end w-full sm:w-auto">
            {/* SELECT FILIAL */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-[140px]">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-300 flex-shrink-0" />

              <select
                value={sheet}
                onChange={(e) => setSheet(e.target.value as Props["sheet"])}
                className="flex-1 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SP">São Paulo - SP</option>
                <option value="Tocantins_SP">Tocantins - SP</option>
                <option value="ES">Espírito Santo - ES</option>
                <option value="PE">Pernambuco - PE</option>
                <option value="Fábrica">Fábrica</option>
              </select>
            </div>

            {/* BOTÃO */}
            <button
              onClick={onNew}
              className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-1 sm:py-2 rounded-lg transition-colors shadow-md text-xs sm:text-sm"
            >
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              Novo Cadastro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
