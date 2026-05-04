"use client";

import { Moon, Sun, Filter, Truck } from "lucide-react";

type Props = {
  mes: string;
  setMes: (value: string) => void;
  estadoFiltro: string;
  setEstadoFiltro: (value: string) => void;
  filialFiltro: string;
  setFilialFiltro: (value: string) => void;
  statusFiltro: string;
  setStatusFiltro: (value: string) => void;
  estados: string[];
  filiais: string[];
  statusList: string[];
  dark: boolean;
  setDark: (value: boolean) => void;
};

const meses = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export default function AnaliseHeader({
  mes,
  setMes,
  estadoFiltro,
  setEstadoFiltro,
  filialFiltro,
  setFilialFiltro,
  statusFiltro,
  setStatusFiltro,
  estados,
  filiais,
  statusList,
  dark,
  setDark,
}: Props) {
  return (
    <div
      className="sticky top-0 z-50 bg-gray-200/95 dark:bg-gray-900
    
     
     backdrop-blur-md px-6 pt-4 flex justify-between items-center mb-6 shadow-lg border-b border-gray-200 dark:border-gray-800 pb-4 transition-colors"
    >
      {/* ESQUERDA */}
      <div>
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 sm:p-3 rounded-2xl shadow-lg border border-blue-500/20 flex-shrink-0">
            <a
              href="https://docs.google.com/spreadsheets/d/1wyqGtYjd9G7LhOGkfYfysagpmFfDJVGxuZRApT-BPwg/edit?gid=1969002979#gid=1969002979"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Truck className="w-8 h-8 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </a>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-text-primary">
            Análise de Entregas Braspress
          </h1>
        </div>
        <p className="text-gray-600 dark:text-text-secondary">
          Dashboard análise de entregas, prazos e distribuição geográfica.
        </p>
      </div>

      {/* DIREITA (FILTROS) */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-gray-700 dark:text-text-secondary">
          <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium">Filtros</span>
        </div>

        {/* MÊS */}
        <select
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="flex-1 text-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {meses.map((m) => (
            <option className="item-center" key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* ESTADO */}
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="flex-1 px-2 text-center  sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos Estados</option>
          {estados.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>

        {/* FILIAL */}
        <select
          value={filialFiltro}
          onChange={(e) => setFilialFiltro(e.target.value)}
          className="flex-1 px-2 text-center  sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas Filiais</option>
          {filiais.map((filial) => (
            <option key={filial} value={filial}>
              {filial}
            </option>
          ))}
        </select>

        {/* STATUS */}
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="flex-1 px-2 text-center  sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos Status</option>
          {statusList.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* DARK MODE */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full bg-white dark:bg-card-dark border border-gray-300 dark:border-card-border hover:bg-gray-50 dark:hover:bg-card-darker transition-colors"
        >
          {dark ? (
            <Sun size={18} className="text-text-primary" />
          ) : (
            <Moon size={18} className="text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
}
