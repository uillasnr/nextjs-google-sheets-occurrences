"use client";

import { Card } from "@/components/ui/card";
import { OccurrenceTypeChart } from "./occurrence-type-chart";
import MonthlyTrendChart from "./Monthly-Trend-Chart";
import type { Occurrence } from "@/types/occurrence";
import { useState } from "react";
import {
  getAvailableYears,
  groupOccurrencesByTransportadora,
  groupOccurrencesByType,
} from "../services/googleSheets/helpers";
import { OccurrenceTypeByTransportadoraChart } from "./occurrence-type-by-transportadora-chart";

interface DashboardProps {
  selectedBranch: "SP" | "PE" | "ES";
  occurrences: Occurrence[];
}

export function Dashboard({ selectedBranch, occurrences }: DashboardProps) {
  const currentYear = new Date().getFullYear();
  const years = getAvailableYears(occurrences);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const typeByMonthData = groupOccurrencesByType(occurrences, selectedYear);
  const byTransportadoraData = groupOccurrencesByTransportadora(
    occurrences,
    selectedYear
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Visão geral das ocorrências - Filial {selectedBranch}
          </p>
        </div>

        {/* Select de ano */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-fit rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Gráficos 1 e 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 justify-items-center">
        <Card className="w-full lg:max-w-3xl border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <MonthlyTrendChart occurrences={occurrences} year={selectedYear} />
        </Card>

        <Card className="w-full lg:max-w-3xl border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <OccurrenceTypeChart data={typeByMonthData} year={selectedYear} />
        </Card>
      </div>

      {/* Gráfico 3 centralizado */}
      <div className="flex justify-center pb-10">
        <Card className="w-full lg:max-w-6xl border border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <OccurrenceTypeByTransportadoraChart
            data={byTransportadoraData}
            year={selectedYear}
          />
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} • Dashboard de Ocorrências
        </p>
      </footer>
    </div>
  );
}
