"use client";

import { Card } from "@/components/ui/card";
import { OccurrenceTypeChart } from "./occurrence-type-chart";
import MonthlyTrendChart from "./Monthly-Trend-Chart";
import type { Occurrence } from "@/types/occurrence";
import { useState } from "react";
import {
  getAvailableYears,
  groupOccurrencesByType,
} from "../services/googleSheets/helpers";

interface DashboardProps {
  selectedBranch: "SP" | "PE" | "ES";
  occurrences: Occurrence[];
}

export function Dashboard({ selectedBranch, occurrences }: DashboardProps) {
  const currentYear = new Date().getFullYear();
  const years = getAvailableYears(occurrences);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const typeByMonthData = groupOccurrencesByType(occurrences, selectedYear);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Visão geral das ocorrências - Filial {selectedBranch}
          </p>
        </div>

        {/* 🎯 SELECT DE ANO */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
        >
          {years.map((year) => (
            <option
              className="text-gray-900 dark:text-gray-100"
              key={year}
              value={year}
            >
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Grid ÚNICO para os dois gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico 1 */}
        <Card className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <MonthlyTrendChart occurrences={occurrences} year={selectedYear} />
        </Card>

        {/* Gráfico 2 */}
        <Card className="border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <OccurrenceTypeChart data={typeByMonthData} year={selectedYear} />
        </Card>
      </div>
    </div>
  );
}
