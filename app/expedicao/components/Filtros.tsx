import { Filtro } from "@/types/Expedicao";
import { Search, Filter } from "lucide-react";

export default function Filtros({
  filtro,
  setFiltro,
  busca,
  setBusca,
}: {
  filtro: Filtro;
  setFiltro: (f: Filtro) => void;
  busca: string;
  setBusca: (b: string) => void;
}) {
  const filtros: { valor: Filtro; label: string; cor: string }[] = [
    { valor: "PENDENTE", label: "Pendente", cor: "amber" },
    { valor: "EXPEDIDO", label: "Expedido ", cor: "emerald" },
    { valor: "TODOS", label: "Todas", cor: "blue" },
  ];

  return (
    <div className="space-y-4">
      {/* BUSCA */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="Buscar por NF ou cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
        />
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          Filtrar por:
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filtros.map(({ valor, label, cor }) => (
            <button
              key={valor}
              onClick={() => setFiltro(valor)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95
                ${
                  filtro === valor
                    ? `bg-gradient-to-r from-${cor}-500 to-${cor}-600 text-white shadow-lg shadow-${cor}-500/30`
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}