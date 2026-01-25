import { Expedicao } from "@/types/Expedicao";

export default function ListaExpedicao({
  lista,
  onExpedir,
}: {
  lista: Expedicao[];
  onExpedir: (item: Expedicao) => void;
}) {
  return (
    <div className="space-y-3">
      {lista.map((item) => (
        <div
          key={item.id}
          className=" border border-gray-600 dark:border-gray-600 rounded-xl p-4 flex justify-between bg-gray-300 dark:bg-gray-900/50  shadow-md shadow-gray-400 dark:shadow-gray-900"
        >
          <div>
            <p className="font-bold  text-gray-800 dark:text-gray-100">
              NF {item.nota}
            </p>
            <p className="text-sm text-gray-500">{item.cliente}</p>
             <p className="text-sm text-gray-500">Data da nota: {item.dataNota}</p>
            {item.status === "EXPEDIDO" && item.data && (
              <p className="text-xs text-gray-400">{item.data}</p>
            )}

            {item.status === "EXPEDIDO" && (
              <p className="text-xs mt-1 text-gray-600 ">
                🚚 {item.motorista} • {item.placa}
              </p>
            )}
          </div>

          <div className=" text-right space-y-2">
            <p className="text-xs text-gray-800 dark:text-gray-100">
              {item.volumes} volumes
            </p>

            {item.status === "PENDENTE" ? (
              <button
                onClick={() => onExpedir(item)}
                className="px-4 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700"
              >
                EXPEDIR
              </button>
            ) : (
              <span className="px-4 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                EXPEDIDA
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
