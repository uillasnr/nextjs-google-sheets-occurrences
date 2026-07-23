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
  console.log("ocorrências estado:", data);

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
          /*   margin={{ top: 20, right: 20, left: 180, bottom: 20 }} */
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
              interval={0}
              stroke="oklch(0.55 0.015 240)"
              fontSize={12}
              tick={{ fontSize: 12, fill: "oklch(0.55 0.015 240)" }}
            />
            <Tooltip
              cursor={{ fill: "oklch(0.55 0.015 240)" }}
              formatter={(value: number) => [value, "Ocorrências"]}
              content={({ active, payload }: any) => {
                if (!active || !payload || payload.length === 0) {
                  return null;
                }

                return (
                  <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-md">
                    <p className="text-sm font-semibold  text-gray-900 dark:text-gray-100">
                      {payload[0].payload.estado}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Ocorrências: {payload[0].value}
                    </p>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="count"
              fill="oklch(0.65 0.24 264)"
              radius={[8, 8, 8, 8]}
              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
            >
       {/*        <LabelList dataKey="estado" position="insideLeft" style={{ fill: "#ffffff", fontSize: 11, fontWeight: 600 }} /> */}
            </Bar>
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
