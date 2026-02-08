"use client";

import { formatDateBR } from "@/lib/formatDate";
import { Expedicao } from "@/types/Expedicao";
import { useMemo, useState, ReactNode } from "react";
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
import CardExpedido from "./cards/CardExpedido";
import CardAguardando from "./cards/CardAguardando";
import CardNotaDisponivel from "./cards/CardNotaDisponivel";

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

  const hasDisponiveis = gruposDisponiveis.length > 0;
  const hasAguardando = gruposAguardando.length > 0;
  const hasExpedidos = gruposExpedidos.length > 0;

  return (
    <div className="space-y-8">
      {/* ================= NF DISPONÍVEIS ================= */}
      {hasDisponiveis && (
        <section>
          <SectionHeader
            icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            title="Notas Disponíveis"
            subtitle="Notas prontas para serem retiradas pelos motoristas"
            color="blue"
            total={lista.filter((i) => i.status === "NF DISPONIVEIS").length}
          />

          <div className="space-y-3">
            {gruposDisponiveis.map((grupo) => {
              const isExpanded = expandedCliente === `disponiveis-${grupo.cliente}`;
              const totalVolumes = grupo.nfs.reduce(
                (acc, nf) => acc + Number(nf.volumes || 0),
                0
              );

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
          <SectionHeader
            icon={<Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            title="Aguardando Retirada"
            subtitle="Notas aguardando motorista para retirada"
            color="amber"
            total={lista.filter((i) => i.status === "AGUARDANDO").length}
          />

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
            subtitle="Notas já expedidas com dados de transporte"
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
}: any) {
  const colorMap: any = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-3">
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
        </div>
        {isExpanded ? <ChevronUp className="text-gray-700 dark:text-gray-100" /> : <ChevronDown className="text-gray-700 dark:text-gray-100" />}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 p-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
