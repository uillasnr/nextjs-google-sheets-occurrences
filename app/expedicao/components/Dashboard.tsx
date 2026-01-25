"use client";

import { Expedicao, Filtro } from "@/types/Expedicao";

import { Clock, CheckCircle2, Layers } from "lucide-react";
import React from "react";


interface DashboardProps {
  lista: Expedicao[];
  filtroAtual: Filtro;
  setFiltro: (f: Filtro) => void;
}

export default function Dashboard({
  lista,
  filtroAtual,
  setFiltro,
}: DashboardProps) {
  const pendentes = lista.filter((i) => i.status === "PENDENTE").length;
  const expedido = lista.filter((i) => i.status === "EXPEDIDO").length;
  const total = lista.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard
        label="Pendentes"
        value={pendentes}
        icon={Clock}
        bgColor="bg-amber-100"
        iconColor="text-amber-600"
        active={filtroAtual === "PENDENTE"}
        onClick={() =>
          setFiltro(filtroAtual === "PENDENTE" ? "TODOS" : "PENDENTE")
        }
      />

      <StatCard
        label="Expedido"
        value={expedido}
        icon={CheckCircle2}
        bgColor="bg-emerald-100"
        iconColor="text-emerald-600"
        active={filtroAtual === "EXPEDIDO"}
        onClick={() =>
          setFiltro(filtroAtual === "EXPEDIDO" ? "TODOS" : "EXPEDIDO")
        }
      />

      <StatCard
        label="Total"
        value={total}
        icon={Layers}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
        active={filtroAtual === "TODOS"}
        onClick={() => setFiltro("TODOS")}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: any;
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
      className={`bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-sm border p-4 text-left transition
        ${
          active
            ? "border-blue-600 ring-2 ring-blue-200"
            : "border-slate-200 hover:border-blue-300"
        }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${iconColor}`}>{value}</p>
        </div>

        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </button>
  );
}
