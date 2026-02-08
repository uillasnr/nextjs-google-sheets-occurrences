"use client";

import { Expedicao, Filtro } from "@/types/Expedicao";
import { FileText, Clock, CheckCircle2, Layers } from "lucide-react";
import React from "react";

interface DashboardProps {
  lista: Expedicao[];
  filtroAtual: Filtro;
  setFiltro: (f: Filtro) => void;
}

export default function StatusCard({
  lista,
  filtroAtual,
  setFiltro,
}: DashboardProps) {
  const disponiveis = lista.filter((i) => i.status === "NF DISPONIVEIS").length;
  const aguardando = lista.filter((i) => i.status === "AGUARDANDO").length;
  const expedido = lista.filter((i) => i.status === "EXPEDIDO").length;
  const total = lista.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        label="Disponíveis"
        value={disponiveis}
        icon={FileText}
        bgColor="bg-blue-100 dark:bg-blue-900/30"
        iconColor="text-blue-600 dark:text-blue-400"
        active={filtroAtual === "NF DISPONIVEIS"}
        onClick={() =>
          setFiltro(filtroAtual === "NF DISPONIVEIS" ? "TODOS" : "NF DISPONIVEIS")
        }
      />

      <StatCard
        label="Aguardando"
        value={aguardando}
        icon={Clock}
        bgColor="bg-amber-100 dark:bg-amber-900/30"
        iconColor="text-amber-600 dark:text-amber-400"
        active={filtroAtual === "AGUARDANDO"}
        onClick={() =>
          setFiltro(filtroAtual === "AGUARDANDO" ? "TODOS" : "AGUARDANDO")
        }
      />

      <StatCard
        label="Expedido"
        value={expedido}
        icon={CheckCircle2}
        bgColor="bg-emerald-100 dark:bg-emerald-900/30"
        iconColor="text-emerald-600 dark:text-emerald-400"
        active={filtroAtual === "EXPEDIDO"}
        onClick={() =>
          setFiltro(filtroAtual === "EXPEDIDO" ? "TODOS" : "EXPEDIDO")
        }
      />

      <StatCard
        label="Total"
        value={total}
        icon={Layers}
        bgColor="bg-gray-100 dark:bg-gray-800"
        iconColor="text-gray-600 dark:text-gray-400"
        active={filtroAtual === "TODOS"}
        onClick={() => setFiltro("TODOS")}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  active: boolean;
  onClick: () => void;
}

function StatCard({
  label,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  active,
  onClick,
}: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border p-4 text-left transition-all duration-200
        ${
          active
            ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900/50 scale-[1.02]"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className={`text-2xl font-bold mt-1 ${iconColor}`}>{value}</p>
        </div>

        <div className={`${bgColor} p-2.5 rounded-xl`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </button>
  );
}
