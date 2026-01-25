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
  const filtros = [
  {
    valor: "PENDENTE",
    label: "Pendente",
    classe:
      "bg-gradient-to-r from-amber-600 to-amber-800 shadow-amber-500/30",
  },
  {
    valor: "EXPEDIDO",
    label: "Expedido",
    classe:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30",
  },
  {
    valor: "TODOS",
    label: "Todas",
    classe:
      "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/30",
  },
] as const;


  
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
  {filtros.map(({ valor, label, classe }) => (
    <button
      key={valor}
      onClick={() => setFiltro(valor)}
      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
        hover:scale-105 active:scale-95
        ${
          filtro === valor
            ? `${classe} text-white shadow-lg`
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