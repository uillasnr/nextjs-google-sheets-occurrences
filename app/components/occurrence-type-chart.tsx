"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

interface Props {
  data: any[];
  year: number;
}

const TYPE_COLORS = [
  "oklch(63.4% 0.400 157.2)",
  "oklch(0.65 0.24 264)",
  "oklch(73.3% 0.000 86.7)",
  "oklch(43.1% 0.400 64.2)",
  "oklch(64.7% 0.211 81.6)",
  "oklch(44.1% 0.018 186.8)",
  "oklch(0.54 0.08 234)",
];

export function OccurrenceTypeChart({ data, year }: Props) {
  console.log("OccurrenceTypeChart data:", data);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  // 🔹 Descobre todos os tipos
  const types = Array.from(
    new Set(
      data.flatMap((item) => Object.keys(item).filter((key) => key !== "month"))
    )
  );

  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{year}</p>
      <CardHeader>
        <CardTitle className="dark:text-gray-100">
          Ocorrências por tipo
        </CardTitle>
      </CardHeader>

      <ResponsiveContainer width="100%" height={300}>
        <ChartContainer config={{}}>
          <BarChart
            data={data}
            barGap={12} // 👈 espaço ENTRE barras do mesmo mês
            barCategoryGap="10%" // 👈 espaço ENTRE os meses
          >
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
              cursor={{ fill: "oklch(0.55 0.015 240)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;

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
                    <p className="text-sm font-semibold mb-2">{label}</p>

                    <div className="space-y-1">
                      {payload.map((item: any) => (
                        <div
                          key={item.dataKey}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600 dark:text-gray-300">
                            {item.dataKey}
                          </span>
                          <span className="font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />

            <Legend />

            {types.map((type, index) => (
              <Bar
                key={type}
                dataKey={type}
                barSize={6}
                maxBarSize={8}
                radius={[8, 8, 8, 8]}
                fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                opacity={0.95}
                isAnimationActive
                animationDuration={600}
                animationEasing="ease-out"
              />
            ))}
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
