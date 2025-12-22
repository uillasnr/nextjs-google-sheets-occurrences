"use client";

import { Truck, Building2, Plus } from "lucide-react";
import dynamic from "next/dynamic";

interface HeaderProps {
  sheet: "SP" | "PE" | "ES";
  setSheet: (sheet: "SP" | "PE" | "ES") => void;
  onNew: () => void;
}

export default function Header({ sheet, setSheet, onNew }: HeaderProps) {
  const ThemeToggle = dynamic(
    () => import("./ThemeToggle").then((mod) => mod.ThemeToggle),
    {
      ssr: false,
    }
  );

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 sm:p-3 rounded-2xl shadow-lg border border-blue-500/20 flex-shrink-0">
              <a
                href="https://docs.google.com/spreadsheets/d/1wyqGtYjd9G7LhOGkfYfysagpmFfDJVGxuZRApT-BPwg/edit?gid=1969002979#gid=1969002979"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </a>
            </div>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight truncate">
                Ocorrências de Transporte
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                Sistema de Gestão de Ocorrências.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end w-full sm:w-auto">
            <div suppressHydrationWarning>
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-1 sm:gap-3 min-w-[120px]">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground dark:text-gray-100 flex-shrink-0" />
              <select
                value={sheet}
                onChange={(e) => setSheet(e.target.value as "SP" | "PE" | "ES")}
                className="flex-1 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SP">São Paulo - SP</option>
                <option value="ES">Espírito Santo - ES</option>
                <option value="PE">Pernambuco - PE</option>
              </select>
            </div>

            <button
              onClick={onNew}
              className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-5 py-1 sm:py-2 rounded-lg transition-colors shadow-md text-xs sm:text-sm"
            >
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              Nova Ocorrência
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
