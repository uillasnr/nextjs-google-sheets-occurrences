"use client";

import { Expedicao } from "@/types/Expedicao";
import { useMemo, useState, ReactNode } from "react";
import {
  FileText,
  User,
  Clock,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Users,
  Truck,
  Package,
  Check,
} from "lucide-react";
import CardExpedido from "./cards/CardExpedido";
import CardAguardando from "./cards/CardAguardando";
import CardNotaDisponivel from "./cards/CardNotaDisponivel";

interface ListaExpedicaoProps {
  lista: Expedicao[];
  onExpedir: (item: Expedicao) => void;
  onAguardar: (item: Expedicao) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onDeselectAll: () => void;
}

export default function ListaExpedicao({
  lista,
  onExpedir,
  onAguardar,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
}: ListaExpedicaoProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedCliente, setExpandedCliente] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  function agruparPorCliente(lista: Expedicao[]) {
    const mapa: Record<string, Expedicao[]> = {};

    lista.forEach((nf) => {
      const key = nf.cliente?.trim() || "Sem cliente";
      if (!mapa[key]) mapa[key] = [];
      mapa[key].push(nf);
    });

    return Object.entries(mapa)
      .map(([cliente, nfs]) => ({ cliente, nfs }))
      .sort((a, b) => a.cliente.localeCompare(b.cliente));
  }

  const gruposDisponiveis = useMemo(() => {
    const disponveis = lista.filter((i) => i.status === "NF DISPONIVEIS");
    return agruparPorCliente(disponveis);
  }, [lista]);

  const gruposAguardando = useMemo(() => {
    const aguardando = lista.filter((i) => i.status === "AGUARDANDO");
    return agruparPorCliente(aguardando);
  }, [lista]);

  const gruposExpedidos = useMemo(() => {
    const expedidos = lista.filter((i) => i.status === "EXPEDIDO");
    return agruparPorCliente(expedidos);
  }, [lista]);

  const allAguardandoIds = useMemo(() => {
    return lista.filter((i) => i.status === "AGUARDANDO").map((i) => i.id);
  }, [lista]);

  const allAguardandoSelected = allAguardandoIds.length > 0 && allAguardandoIds.every((id) => selectedIds.includes(id));

  const hasDisponiveis = gruposDisponiveis.length > 0;
  const hasAguardando = gruposAguardando.length > 0;
  const hasExpedidos = gruposExpedidos.length > 0;

  return (
    <div className="space-y-8">
      {/* ================= NF DISPONIVEIS ================= */}
      {hasDisponiveis && (
        <section>
          <SectionHeader
            icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            title="Notas Disponiveis"
            subtitle="Notas prontas para serem retiradas pelos motoristas"
            color="blue"
            total={lista.filter((i) => i.status === "NF DISPONIVEIS").length}
          />

          <div className="space-y-3">
            {gruposDisponiveis.map((grupo) => {
              const isExpanded = expandedCliente === `disponiveis-${grupo.cliente}`;

              if (grupo.nfs.length === 1) {
                const nf = grupo.nfs[0];
                return (
                  <CardNotaDisponivel
                    key={nf.id}
                    item={nf}
                    onAguardar={() => onAguardar(nf)}
                  />
                );
              }

              return (
                <GrupoClienteCard
                  key={grupo.cliente}
                  grupo={grupo}
                  isExpanded={isExpanded}
                  color="blue"
                  onToggle={() =>
                    setExpandedCliente(isExpanded ? null : `disponiveis-${grupo.cliente}`)
                  }
                >
                  {grupo.nfs.map((nf) => (
                    <CardNotaDisponivel
                      key={nf.id}
                      item={nf}
                      onAguardar={() => onAguardar(nf)}
                      compact
                    />
                  ))}
                </GrupoClienteCard>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= AGUARDANDO ================= */}
      {hasAguardando && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              icon={<Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              title="Aguardando Retirada"
              subtitle="Selecione as notas para expedir"
              color="amber"
              total={lista.filter((i) => i.status === "AGUARDANDO").length}
            />
          </div>

          {/* Barra de selecao para Aguardando */}
          <div className="mb-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (allAguardandoSelected) {
                  onDeselectAll();
                } else {
                  onSelectAll(allAguardandoIds);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                ${allAguardandoSelected
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                ${allAguardandoSelected
                  ? "bg-white border-white"
                  : "border-gray-400 dark:border-gray-500"
                }`}
              >
                {allAguardandoSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </div>
              {allAguardandoSelected ? "Desmarcar Todas" : "Selecionar Todas"}
            </button>

            {selectedIds.length > 0 && (
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800">
                {selectedIds.length} selecionada{selectedIds.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {gruposAguardando.map((grupo) => {
              const isExpanded = expandedCliente === `aguardando-${grupo.cliente}`;

              if (grupo.nfs.length === 1) {
                const nf = grupo.nfs[0];
                return (
                  <CardAguardando
                    key={nf.id}
                    item={nf}
                    index={0}
                    expandedId={expandedId}
                    toggleExpand={toggleExpand}
                    onExpedir={() => onExpedir(nf)}
                    selectable
                    selected={selectedIds.includes(nf.id)}
                    onToggleSelect={() => onToggleSelect(nf.id)}
                  />
                );
              }

              return (
                <GrupoClienteCard
                  key={grupo.cliente}
                  grupo={grupo}
                  isExpanded={isExpanded}
                  color="amber"
                  onToggle={() =>
                    setExpandedCliente(isExpanded ? null : `aguardando-${grupo.cliente}`)
                  }
                  selectable
                  selectedIds={selectedIds}
                  groupIds={grupo.nfs.map((nf) => nf.id)}
                  onToggleSelectGroup={(ids: string[]) => {
                    const allSelected = ids.every((id) => selectedIds.includes(id));
                    if (allSelected) {
                      ids.forEach((id) => onToggleSelect(id));
                    } else {
                      onSelectAll([...selectedIds, ...ids.filter((id) => !selectedIds.includes(id))]);
                    }
                  }}
                >
                  {grupo.nfs.map((nf, index) => (
                    <CardAguardando
                      key={nf.id}
                      item={nf}
                      index={index}
                      expandedId={expandedId}
                      toggleExpand={toggleExpand}
                      onExpedir={() => onExpedir(nf)}
                      compact
                      selectable
                      selected={selectedIds.includes(nf.id)}
                      onToggleSelect={() => onToggleSelect(nf.id)}
                    />
                  ))}
                </GrupoClienteCard>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= EXPEDIDOS ================= */}
      {hasExpedidos && (
        <section>
          <SectionHeader
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            title="Expedidos"
            subtitle="Notas ja expedidas com dados de transporte"
            color="emerald"
            total={lista.filter((i) => i.status === "EXPEDIDO").length}
          />

          <div className="space-y-3">
            {gruposExpedidos.map((grupo) => {
              const isExpanded = expandedCliente === `expedidos-${grupo.cliente}`;

              if (grupo.nfs.length === 1) {
                const nf = grupo.nfs[0];
                return (
                  <CardExpedido
                    key={nf.id}
                    item={nf}
                    index={0}
                    expandedId={expandedId}
                    toggleExpand={toggleExpand}
                  />
                );
              }

              return (
                <GrupoClienteCard
                  key={grupo.cliente}
                  grupo={grupo}
                  isExpanded={isExpanded}
                  color="emerald"
                  onToggle={() =>
                    setExpandedCliente(isExpanded ? null : `expedidos-${grupo.cliente}`)
                  }
                >
                  {grupo.nfs.map((nf, index) => (
                    <CardExpedido
                      key={nf.id}
                      item={nf}
                      index={index}
                      expandedId={expandedId}
                      toggleExpand={toggleExpand}
                      compact
                    />
                  ))}
                </GrupoClienteCard>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  total,
  color,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  total: number;
  color: "blue" | "amber" | "emerald";
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    emerald:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <span className={`ml-auto text-sm font-bold px-3 py-1 rounded-full ${colors[color]}`}>
        {total} notas
      </span>
    </div>
  );
}

function GrupoClienteCard({
  grupo,
  isExpanded,
  onToggle,
  children,
  color,
  selectable = false,
  selectedIds = [],
  groupIds = [],
  onToggleSelectGroup,
}: {
  grupo: { cliente: string; nfs: Expedicao[] };
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  color: "blue" | "amber" | "emerald";
  selectable?: boolean;
  selectedIds?: string[];
  groupIds?: string[];
  onToggleSelectGroup?: (ids: string[]) => void;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  };

  const allGroupSelected = groupIds.length > 0 && groupIds.every((id) => selectedIds.includes(id));
  const someGroupSelected = groupIds.some((id) => selectedIds.includes(id));

  return (
    <div className={`bg-white dark:bg-gray-800/50 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg
      ${someGroupSelected && selectable
        ? "border-blue-400 dark:border-blue-600"
        : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="w-full p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {selectable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelectGroup?.(groupIds);
              }}
              className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                ${allGroupSelected
                  ? "bg-blue-600 border-blue-600 text-white scale-110"
                  : someGroupSelected
                    ? "bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                }`}
            >
              {allGroupSelected && <Check className="w-4 h-4" />}
              {someGroupSelected && !allGroupSelected && <div className="w-2.5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded" />}
            </button>
          )}

          <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-3 flex-1 text-left"
          >
            <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                {grupo.cliente}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {grupo.nfs.length} notas fiscais
              </p>
            </div>
          </button>
        </div>

        <button type="button" onClick={onToggle}>
          {isExpanded ? <ChevronUp className="text-gray-700 dark:text-gray-100" /> : <ChevronDown className="text-gray-700 dark:text-gray-100" />}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 p-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
