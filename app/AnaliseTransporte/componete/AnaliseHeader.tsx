"use client";

import { Moon, Sun, Filter, Truck, Building2 } from "lucide-react";

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
  remetenteFiltro: string;
  setRemetenteFiltro: (value: string) => void;
  remetentes: string[];
};

const remetentesMap: Record<string, string> = {
  "8383758000168": "BR Motors Matriz",
  "8383758001210": "BR Motors Tocantins",
  "44440569000143": "BR Motors Fábrica",
  "8383758000249": "BR Motors ES",
  "8383758000400": "BR Motors PE",
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
  remetenteFiltro,
  setRemetenteFiltro,
  remetentes,
}: Props) {
  return (
    <div className="sticky top-0 z-50 bg-gray-200/95 dark:bg-gray-900 backdrop-blur-md px-6 pt-4 mb-6 shadow-lg border-b border-gray-200 dark:border-gray-800 pb-4 transition-colors">
      <div className="flex justify-between items-start gap-6 flex-wrap">
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
                <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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

        {/* DIREITA */}
        <div className="flex flex-col items-end gap-3">
          {/* LINHA SUPERIOR */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <div className="flex items-center gap-2 text-gray-700 dark:text-text-secondary">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground dark:text-gray-100 flex-shrink-0" />
              <span className="text-sm font-medium">Filtros</span>
            </div>

            {/* MÊS */}
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-36 text-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {meses.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* ESTADO */}
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-40 text-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-44 text-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-44 text-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* 🔥 LINHA INFERIOR - REMETENTE */}
          <div className="w-full flex justify-end flex items-center gap-3">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground dark:text-gray-100 flex-shrink-0" />
            <select
              value={remetenteFiltro}
              onChange={(e) => setRemetenteFiltro(e.target.value)}
              className="w-48 px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas Filiais BR Motors</option>

              {remetentes.map((rem) => (
                <option key={rem} value={rem}>
                  {remetentesMap[rem] || rem}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
