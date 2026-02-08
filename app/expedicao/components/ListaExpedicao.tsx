"use client";

import { formatDateBR } from "@/lib/formatDate";
import { Expedicao } from "@/types/Expedicao";
import { useMemo, useState } from "react";
import {
  FileText,
  User,
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Users,
  Hash,
} from "lucide-react";

interface ListaExpedicaoProps {
  lista: Expedicao[];
  onExpedir: (item: Expedicao) => void;
  onAguardar: (item: Expedicao) => void;
}

export default function ListaExpedicao({
  lista,
  onExpedir,
  onAguardar,
}: ListaExpedicaoProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedCliente, setExpandedCliente] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Agrupa notas "NF DISPONIVEIS" por cliente
  const gruposDisponiveis = useMemo(() => {
    const disponveis = lista.filter((i) => i.status === "NF DISPONIVEIS");
    const mapa: Record<string, Expedicao[]> = {};

    disponveis.forEach((nf) => {
      const key = nf.cliente?.trim() || "Sem cliente";
      if (!mapa[key]) mapa[key] = [];
      mapa[key].push(nf);
    });

    return Object.entries(mapa)
      .map(([cliente, nfs]) => ({ cliente, nfs }))
      .sort((a, b) => a.cliente.localeCompare(b.cliente));
  }, [lista]);

  const aguardando = useMemo(
    () => lista.filter((i) => i.status === "AGUARDANDO"),
    [lista]
  );

  const expedidos = useMemo(
    () => lista.filter((i) => i.status === "EXPEDIDO"),
    [lista]
  );

  // Detecta qual aba mostrar com base nos dados filtrados
  const hasDisponiveis = gruposDisponiveis.length > 0;
  const hasAguardando = aguardando.length > 0;
  const hasExpedidos = expedidos.length > 0;

  // Se nenhum status especifico esta filtrado, mostra todos
  const showAll =
    lista.some((i) => i.status === "NF DISPONIVEIS") ||
    lista.some((i) => i.status === "AGUARDANDO") ||
    lista.some((i) => i.status === "EXPEDIDO");

  return (
    <div className="space-y-8">
      {/* SECAO: NF DISPONIVEIS */}
      {hasDisponiveis && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Notas Disponíveis
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Notas prontas para serem encaminhadas
              </p>
            </div>
            <span className="ml-auto text-sm font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {lista.filter((i) => i.status === "NF DISPONIVEIS").length} notas
            </span>
          </div>

          <div className="space-y-3">
            {gruposDisponiveis.map((grupo) => {
              const isExpanded = expandedCliente === grupo.cliente;
              const totalVolumes = grupo.nfs.reduce(
                (acc, nf) => acc + Number(nf.volumes || 0),
                0
              );

              if (grupo.nfs.length === 1) {
                // Card unico para cliente com 1 nota
                const nf = grupo.nfs[0];
                return (
                  <CardNotaDisponivel
                    key={nf.id}
                    item={nf}
                    onAguardar={() => onAguardar(nf)}
                  />
                );
              }

              // Card agrupado para cliente com multiplas notas
              return (
                <div
                  key={grupo.cliente}
                  className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden
                    transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-800/50"
                >
                  {/* Header do grupo */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCliente(isExpanded ? null : grupo.cliente)
                    }
                    className="w-full p-4 flex items-center justify-between gap-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                          {grupo.cliente}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {grupo.nfs.length} notas fiscais - {totalVolumes}{" "}
                          volumes total
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {grupo.nfs.length} NFs
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Lista de notas do grupo */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {grupo.nfs.map((nf) => (
                        <CardNotaDisponivel
                          key={nf.id}
                          item={nf}
                          onAguardar={() => onAguardar(nf)}
                          compact
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECAO: AGUARDANDO */}
      {hasAguardando && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Aguardando Retirada
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Notas aguardando motorista para retirada
              </p>
            </div>
            <span className="ml-auto text-sm font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              {aguardando.length} notas
            </span>
          </div>

          <div className="space-y-3">
            {aguardando.map((item, index) => (
              <CardAguardando
                key={item.id}
                item={item}
                index={index}
                expandedId={expandedId}
                toggleExpand={toggleExpand}
                onExpedir={() => onExpedir(item)}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECAO: EXPEDIDOS */}
      {hasExpedidos && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Expedidos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Notas já expedidas com dados de transporte
              </p>
            </div>
            <span className="ml-auto text-sm font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
              {expedidos.length} notas
            </span>
          </div>

          <div className="space-y-3">
            {expedidos.map((item, index) => (
              <CardExpedido
                key={item.id}
                item={item}
                index={index}
                expandedId={expandedId}
                toggleExpand={toggleExpand}
              />
            ))}
          </div>
        </section>
      )}

      {/* Estado vazio */}
      {lista.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Nenhuma nota encontrada
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Cadastre uma nova nota para começar
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CARD: Nota Disponível (NF DISPONIVEIS)
// ============================================================
function CardNotaDisponivel({
  item,
  onAguardar,
  compact = false,
}: {
  item: Expedicao;
  onAguardar: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 overflow-hidden
        transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800/40 hover:border-blue-400/50
        ${compact ? "rounded-xl" : "rounded-2xl"}`}
    >
      <div className={compact ? "p-3" : "p-4"}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`${compact ? "p-2" : "p-2.5"} rounded-xl bg-blue-50 dark:bg-blue-900/20 shrink-0`}
            >
              <FileText
                className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-blue-600 dark:text-blue-400`}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`font-bold text-gray-900 dark:text-gray-100 ${compact ? "text-sm" : "text-base"}`}
                >
                  NF {item.nota}
                </h3>
                {!compact && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold">
                    Disponível
                  </span>
                )}
              </div>
              {!compact && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {item.cliente}
                </p>
              )}
            </div>

            {/* Info inline */}
            <div className="hidden sm:flex items-center gap-4 ml-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateBR(item.dataNota)}
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                {item.volumes} vol.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onAguardar}
            className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold
              bg-blue-600 hover:bg-blue-700 text-white
              shadow-sm hover:shadow-md transition-all duration-200 
              flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">Aguardar Retirada</span>
            <span className="sm:hidden">Aguardar</span>
          </button>
        </div>

        {/* Info mobile */}
        <div className="flex sm:hidden items-center gap-3 mt-2 ml-11 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDateBR(item.dataNota)}
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {item.volumes} vol.
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CARD: Aguardando Retirada
// ============================================================
function CardAguardando({
  item,
  index,
  expandedId,
  toggleExpand,
  onExpedir,
}: {
  item: Expedicao;
  index: number;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  onExpedir: () => void;
}) {
  const isExpanded = expandedId === item.id;

  return (
    <div
      className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden
        transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-800/50 hover:border-amber-400/50
        animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                    NF {item.nota}
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold">
                    Aguardando Retirada
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {item.cliente}
                </p>
              </div>
            </div>

            {/* Detalhes da nota */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 ml-12">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDateBR(item.dataNota)}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.volumes} volumes
                </span>
              </div>
            </div>
          </div>

          {/* Botao de expedir */}
          <div className="flex lg:flex-col items-center gap-3">
            <button
              type="button"
              onClick={onExpedir}
              className="w-full lg:w-auto px-6 py-3 rounded-xl text-sm font-bold
                bg-amber-500 hover:bg-amber-600 text-white
                shadow-lg shadow-amber-500/20
                transition-all duration-200 hover:scale-105 active:scale-95
                flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Expedir
            </button>
            <button
              type="button"
              onClick={() => toggleExpand(item.id)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 
                flex items-center gap-1 transition-colors"
            >
              {isExpanded ? "Menos" : "Detalhes"}
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock
              label="Cliente"
              value={item.cliente}
              icon={<User className="w-4 h-4 text-amber-500" />}
            />
            <InfoBlock
              label="Número da Nota"
              value={`NF ${item.nota}`}
              icon={<Hash className="w-4 h-4 text-amber-500" />}
            />
            <InfoBlock
              label="Data da Nota"
              value={formatDateBR(item.dataNota)}
              icon={<Calendar className="w-4 h-4 text-amber-500" />}
            />
            <InfoBlock
              label="Volumes"
              value={`${item.volumes} volumes`}
              icon={<Package className="w-4 h-4 text-amber-500" />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CARD: Expedido
// ============================================================
function CardExpedido({
  item,
  index,
  expandedId,
  toggleExpand,
}: {
  item: Expedicao;
  index: number;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
}) {
  const isExpanded = expandedId === item.id;

  return (
    <div
      className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden
        transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-800/50
        animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                    NF {item.nota}
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">
                    Expedido
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {item.cliente}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 ml-12">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateBR(item.dataNota)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Package className="w-3.5 h-3.5" />
                {item.volumes} vol.
              </div>
              {item.dataExpedicao && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  {item.dataExpedicao}
                </div>
              )}
              {item.motorista && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Truck className="w-3.5 h-3.5" />
                  {item.motorista}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleExpand(item.id)}
            className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold
              bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
              border border-emerald-500/30 hover:bg-emerald-500/20
              transition-all duration-200 flex items-center justify-center gap-2"
          >
            Ver Detalhes
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded transport details */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Dados do Transporte
              </h4>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Motorista
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.motorista || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Placa
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {item.placa || "-"}
                  </span>
                </div>
                {item.cpf && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      CPF
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.cpf}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Datas
              </h4>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Data da Nota
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDateBR(item.dataNota)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Data Expedição
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.dataExpedicao || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Bloco de info reutilizavel
// ============================================================
function InfoBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
}
