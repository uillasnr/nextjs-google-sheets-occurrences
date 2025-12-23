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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { groupOccurrencesByMonth } from "../services/googleSheets/helpers";
import type { Occurrence } from "@/types/occurrence";

interface Props {
  occurrences: Occurrence[];
}

export default function MonthlyTrendChart({ occurrences }: Props) {
  const chartData = groupOccurrencesByMonth(occurrences);

  // Validação de dados vazios
  if (chartData.every((item) => item.total === 0)) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div >
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

            <Bar dataKey="total" fill="#2563EB" radius={8} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.15 0.008 240)",
                border: "1px solid oklch(0.25 0.012 240)",
                borderRadius: "0.5rem",
                color: "oklch(0.95 0.005 240)",
              }}
              formatter={(value: number) => [`${value} ocorrências`, "Total"]}
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
