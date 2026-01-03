import { FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";
import type { Occurrence } from "@/types/occurrence";

interface StatsProps {
  list: Occurrence[];
  activeFilter: "Todos" | "Pendente" | "Em Andamento" | "Resolvido";
  onFilterChange: (filter: StatsProps["activeFilter"]) => void;
}

export default function Stats({
  list,
  activeFilter,
  onFilterChange,
}: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
     

      <StatCard
        label="Pendentes"
        value={list.filter((i) => i.status === "Pendente").length}
        icon={Clock}
        bgColor="bg-amber-100"
        iconColor="text-amber-600"
        active={activeFilter === "Pendente"}
        onClick={() => onFilterChange("Pendente")}
      />

      <StatCard
        label="Em Andamento"
        value={list.filter((i) => i.status === "Em Andamento").length}
        icon={AlertCircle}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
        active={activeFilter === "Em Andamento"}
        onClick={() => onFilterChange("Em Andamento")}
      />

       <StatCard
        label="Total"
        value={list.length}
        icon={FileText}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
        active={activeFilter === "Todos"}
        onClick={() => onFilterChange("Todos")}
      />

      <StatCard
        label="Resolvidos"
        value={list.filter((i) => i.status === "Resolvido").length}
        icon={CheckCircle}
        bgColor="bg-emerald-100"
        iconColor="text-emerald-600"
        active={activeFilter === "Resolvido"}
        onClick={() => onFilterChange("Resolvido")}
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
          <p className="text-sm dark:text-white font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${iconColor}`}>{value}</p>
        </div>

        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </button>
  );
}
