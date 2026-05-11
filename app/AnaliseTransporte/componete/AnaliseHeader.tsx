"use client";

import { Filter, Truck, Building2 } from "lucide-react";

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
  remetenteFiltro,
  setRemetenteFiltro,
  remetentes,
}: Props) {
  return (
    <div className="sticky top-0 z-50 bg-gray-200/95 dark:bg-gray-900 backdrop-blur-md px-6 pt-4 mb-6 shadow-lg border-b border-gray-200 dark:border-gray-800 pb-4 transition-colors">
      <div className="flex justify-between items-start gap-6 flex-wrap">
        <div className="w-full xl:w-auto">
          <div className="inline-flex items-center gap-3 mb-2">
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

            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white leading-tight break-words">
              Análise de Entregas Braspress
            </h1>
          </div>
          <p className="text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Dashboard de análise de entregas e prazos.
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl ml-auto ">
            <div className="flex items-center text-gray-700 dark:text-text-secondary">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground dark:text-gray-100 flex-shrink-0" />
              <span className="text-sm font-medium ">Filtros</span>
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="W-full px-3 ml-2  text-center  py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {meses.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full px-3 py-2 text-center  border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos Estados</option>
              {estados.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>

            <select
              value={filialFiltro}
              onChange={(e) => setFilialFiltro(e.target.value)}
              className="w-full px-3 py-2 text-center  border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todas Filiais</option>
              {filiais.map((filial) => (
                <option key={filial} value={filial}>
                  {filial}
                </option>
              ))}
            </select>

            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="w-full px-3 text-center  py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos Status</option>
              {statusList.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end items-center gap-2">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground dark:text-gray-100 flex-shrink-0" />
            <select
              value={remetenteFiltro}
              onChange={(e) => setRemetenteFiltro(e.target.value)}
              className="w-full md:w-64 px-3 text-center py-2 border-2 border-blue-500/20 dark:border-blue-500/40 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
