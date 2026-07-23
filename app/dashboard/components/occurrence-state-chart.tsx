"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

interface Props {
  data: { estado: string; count: number }[];
  year: number;
}

export function OccurrenceStateChart({ data, year }: Props) {
  if (!data || data.length === 0) {
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
          Ocorrências por estado
        </CardTitle>
      </CardHeader>

      <ResponsiveContainer width="100%" height={320}>
        <ChartContainer config={{ count: { label: "Ocorrências" } }}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.25 0.012 240)"
            />
            <XAxis
              type="number"
              stroke="oklch(0.55 0.015 240)"
              fontSize={12}
            />
            <YAxis
              type="category"
              dataKey="estado"
              width={120}
              stroke="oklch(0.55 0.015 240)"
              fontSize={12}
            />
            <Tooltip
              cursor={{ fill: "oklch(0.55 0.015 240)" }}
              formatter={(value: number) => [value, "Ocorrências"]}
            />
            <Bar
              dataKey="count"
              fill="oklch(0.65 0.24 264)"
              radius={[8, 8, 8, 8]}
              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
