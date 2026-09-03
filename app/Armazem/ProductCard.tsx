import { useState } from "react";
import {
  Trash2,
  Package,
  FileText,
  Truck,
  Hash,
  CalendarDays,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  Clock3,
  TruckIcon,
} from "lucide-react";

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-2xl bg-gray-50/80 p-3 dark:bg-gray-800/70">
      <div className="flex items-center gap-2 text-[10px]  font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-gray-800  dark:text-gray-100">
        {value || "-"}
      </div>
    </div>
  );
}

export default function ProductCard({ data, onDelete }: any) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleDeleteAttempt = () => {
    if (password === "1010") {
      onDelete(data.id);
      setShowDeleteConfirm(false);
      setPassword("");
      setError("");
      return;
    }

    setError("Senha incorreta");
  };

  const status = data.status || "Pendente";
  const isFinished = status === "Finalizado";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 text-white shadow-sm">
            <Package className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Nota fiscal
            </p>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {data.nota || "Nota não informada"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${
              isFinished
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            {isFinished ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Clock3 className="h-3.5 w-3.5" />
            )}
            {status}
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl p-2 text-red-500 transition hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <InfoItem icon={FileText} label="NF" value={data.nota} />
         <InfoItem icon={TruckIcon} label="Transportadora" value={data.transportadora} />
        <InfoItem icon={ClipboardList} label="Filial" value={data.filial} />
        <InfoItem icon={Hash} label="Itens" value={data.itens?.length || 0} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {data.ocorrencia ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            {data.ocorrencia}
          </span>
        ) : null}

        {data.tipoOcorrencia ? (
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {data.tipoOcorrencia}
          </span>
        ) : null}
      </div>

      {data.itens?.length ? (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/60">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Produtos da nota
            </p>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {data.itens.length} item(s)
            </span>
          </div>

          <div className="space-y-2">
            {data.itens.map((item: any, index: number) => (
              <div
                key={`${item.sku}-${index}`}
                 className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900" 
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.sku || "SKU não informado"}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {item.descricao || "Sem descrição"}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {item.quantidade || "0"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {(data.dataEntrada48 || data.dataSaida48 || data.tracking || data.obs) && (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-200 p-3 dark:border-gray-700">
          <div className="grid gap-2 text-xs text-gray-600 dark:text-gray-300">
            {data.dataEntrada48 ? (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Entrada 48: {data.dataEntrada48}</span>
              </div>
            ) : null}

            {data.dataSaida48 ? (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Saída 48: {data.dataSaida48}</span>
              </div>
            ) : null}

            {data.tracking ? (
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5" />
                <span>Tracking: {data.tracking}</span>
              </div>
            ) : null}

            {data.obs ? (
              <div className="flex items-start gap-2">
                <MessageSquare className="mt-0.5 h-3.5 w-3.5" />
                <span>{data.obs}</span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirmar exclusão
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Digite a senha para remover esta nota fiscal.
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Senha"
              className="mt-4 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
            />

            {error ? (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPassword("");
                  setError("");
                }}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAttempt}
                className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
