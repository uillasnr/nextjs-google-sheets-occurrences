import { Trash2, Package, FileText, Truck, Hash } from "lucide-react";

export default function ProductCard({ data, onDelete }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg shadow">
            <Package className="w-4 h-4 text-white" />
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white">
            {data.sku}
          </h3>
        </div>

        <button
          onClick={() => onDelete(data.id)}
          className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* DESCRIÇÃO */}
      <p className="text-sm text-gray-500 line-clamp-2">
        {data.descricao || "Sem descrição"}
      </p>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>{data.nota}</span>
        </div>

        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4" />
          <span>{data.quantidade}</span>
        </div>

        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4" />
          <span>{data.transportadora || "-"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span>{data.filial}</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
        <span className="text-[10px] text-gray-400">
          {data.ocorrencia || "-"}
        </span>

        <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          {data.tipoOcorrencia || "N/A"}
        </span>
      </div>
    </div>
  );
}
