"use client";

import { Card } from "@/components/ui/card";
import { OccurrenceTypeChart } from "./occurrence-type-chart";
import MonthlyTrendChart from "./Monthly-Trend-Chart";
import type { Occurrence } from "@/types/occurrence";

interface DashboardProps {
  selectedBranch: "SP" | "PE" | "ES";
  occurrences: Occurrence[];
}

export function Dashboard({ selectedBranch, occurrences }: DashboardProps) {
  return (
     <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Dashboard
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visão geral das ocorrências - Filial {selectedBranch}
        </p>
      </div>

      {/* Grid ÚNICO para os dois gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico 1 */}
        <Card className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <MonthlyTrendChart occurrences={occurrences} />
        </Card>

        {/* Gráfico 2 */}
        <Card className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <OccurrenceTypeChart occurrences={occurrences} />
        </Card>
      </div>
    </div>
  );
}
