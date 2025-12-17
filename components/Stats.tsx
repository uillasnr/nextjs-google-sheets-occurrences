import { FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import type { Occurrence } from '@/types/occurrence';

interface StatsProps {
  list: Occurrence[];
}

export default function Stats({ list }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Total"
        value={list.length}
        icon={FileText}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />

      <StatCard
        label="Pendentes"
        value={list.filter(i => i.status === 'Pendente').length}
        icon={Clock}
        bgColor="bg-amber-100"
        iconColor="text-amber-600"
      />

      <StatCard
        label="Em Andamento"
        value={list.filter(i => i.status === 'Em Andamento').length}
        icon={AlertCircle}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />

      <StatCard
        label="Resolvidos"
        value={list.filter(i => i.status === 'Resolvido').length}
        icon={CheckCircle}
        bgColor="bg-emerald-100"
        iconColor="text-emerald-600"
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
}

function StatCard({ label, value, icon: Icon, bgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${iconColor}`}>{value}</p>
        </div>

        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
