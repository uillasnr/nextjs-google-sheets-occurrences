import { Filtro } from "@/types/Expedicao";
import { Search, Filter, Package } from "lucide-react";

export default function Filtros({
  filtro,
  setFiltro,
  busca,
  setBusca,
  onAbrirRomaneio,
  romaneioAtivo,
}: {
  filtro: Filtro;
  setFiltro: (f: Filtro) => void;
  busca: string;
  setBusca: (b: string) => void;
  onAbrirRomaneio: () => void;
  romaneioAtivo: boolean;
}) {
  const filtros = [
    { valor: "PENDENTE", label: "Pendente", classe: "from-amber-600 to-amber-800" },
    { valor: "EXPEDIDO", label: "Expedido", classe: "from-emerald-500 to-emerald-600" },
    { valor: "TODOS", label: "Todas", classe: "from-blue-500 to-blue-600" },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 space-y-4 shadow-sm">

      {/* 🔎 BUSCA */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por NF ou cliente..."
          value={busca}
          disabled={romaneioAtivo}
          onChange={(e) => setBusca(e.target.value)}
          className={`w-full pl-12 pr-4 py-4 rounded-xl font-medium transition
            ${romaneioAtivo
              ? "bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600  cursor-not-allowed"
              : "w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
            }`}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          Filtrar por:
        </div>

        <div className="flex flex-wrap gap-2">
          {filtros.map(({ valor, label, classe }) => {
            const ativo = filtro === valor && !romaneioAtivo;

            return (
              <button
                key={valor}
                disabled={romaneioAtivo}
                onClick={() => setFiltro(valor)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition
                  ${romaneioAtivo
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : ativo
                      ? `bg-gradient-to-r ${classe} text-white shadow-lg`
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 📦 BOTÃO ROMANEIO */}
        <button
          onClick={onAbrirRomaneio}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition
            ${romaneioAtivo
              ? "bg-gray-100 dark:bg-gray-400 text-gray-700 dark:text-gray-300  shadow-lg shadow-gray-500/30"
              : "bg-gray-100 dark:bg-gray-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
        >
          <Package className="w-4 h-4" />
          {romaneioAtivo ? "Romaneio" : "Criar Romaneio"}
        </button>
      </div>
    </div>
  );
}
