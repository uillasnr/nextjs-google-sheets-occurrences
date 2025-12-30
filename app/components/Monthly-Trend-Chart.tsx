"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  YAxis,
  Tooltip,
} from "recharts";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { groupOccurrencesByMonth } from "../services/googleSheets/helpers";
import type { Occurrence } from "@/types/occurrence";

interface Props {
  occurrences: Occurrence[];
  year: number;
}

export default function MonthlyTrendChart({ occurrences, year }: Props) {
  const chartData = groupOccurrencesByMonth(occurrences, year);

  console.log("Ocorrencias por mes:", chartData);

  // Validação de dados vazios
  if (chartData.every((item) => item.total === 0)) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhum dado disponível {year}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{year}</p>
      <CardHeader>
        <CardTitle className="dark:text-gray-100">
          Ocorrências por mês
        </CardTitle>
      </CardHeader>

      <ResponsiveContainer width="100%" height={300}>
        <ChartContainer config={{ total: { label: "Ocorrências" } }}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.25 0.012 240)"
            />
            <XAxis
              dataKey="month"
              stroke="oklch(0.55 0.015 240)"
              fontSize={12}
            />
            <YAxis stroke="oklch(0.55 0.015 240)" fontSize={12} />

            <Tooltip
              wrapperStyle={{ pointerEvents: "auto" }}
              cursor={{ fill: "oklch(0.55 0.015 240)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;

                const { total, notas } = payload[0].payload;

                return (
                  <div
                    className="
          w-64
          rounded-xl
          border
          border-gray-200 dark:border-white/10
          bg-white/95 dark:bg-gray-900/95
          backdrop-blur-md
          p-4
          shadow-xl
          text-gray-900 dark:text-gray-100
        "
                  >
                    {/* Header */}
                    <div className="mb-2">
                      <p className="text-sm font-semibold tracking-wide">
                        {label}
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          / {year}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Total de ocorrências
                      </p>
                    </div>

                    {/* Total */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Quantidade
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {total}
                      </span>
                    </div>

                    {/* Notas */}
                    {notas?.length > 0 && (
                      <>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Números das notas
                        </p>

                        <div className="max-h-32 overflow-auto rounded-md bg-gray-100 dark:bg-black/30 p-2">
                          <div className="grid grid-cols-2 gap-2">
                            {notas.map((nota: string, index: number) => (
                              <span
                                key={index}
                                className="
                      flex
                      items-center
                      justify-center
                      rounded-md
                      px-2
                      py-1
                      text-xs
                      font-medium
                      text-gray-700 dark:text-gray-200
                      bg-white dark:bg-white/5
                      hover:bg-blue-100 dark:hover:bg-blue-500/20
                      cursor-pointer
                    "
                              >
                                NF {nota}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              }}
            />
            <Bar
              dataKey="total"
              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
              fill="oklch(0.65 0.24 264)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
