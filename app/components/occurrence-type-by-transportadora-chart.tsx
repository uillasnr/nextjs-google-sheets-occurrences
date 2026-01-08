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
import { useState } from "react";

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

export function OccurrenceTypeByTransportadoraChart({ data, year }: Props) {
  const [tooltipData, setTooltipData] = useState<any>(null);

  console.log("transportadoras", data);

  const hasData =
    data &&
    data.some((item) =>
      Object.entries(item.transportadoras ?? {}).some(([_, tipos]: any) =>
        Object.values(tipos ?? {}).some((valor: any) => Number(valor) > 0)
      )
    );

  if (!hasData) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhum dado disponível {year}</p>
      </div>
    );
  }

  const transportadoras = Array.from(
    new Set(
      data.flatMap((item) => Object.keys(item).filter((key) => key !== "month"))
    )
  );

  const tipos = Array.from(
    new Set(
      data.flatMap((item) =>
        Object.keys(item)
          .filter((key) => key !== "month")
          .flatMap((transportadora) => Object.keys(item[transportadora] ?? {}))
      )
    )
  );

  const chartData = data.flatMap((item) =>
    transportadoras.map((transportadora) => {
      const tiposDaTransportadora = item[transportadora] ?? {};

      const row: any = {
        month: item.month,
        transportadora,
        transportadoras: item.transportadoras, // ✅ MANTÉM O OBJETO ORIGINAL
      };
      tipos.forEach((tipo) => {
        const valor = tiposDaTransportadora[tipo];

        row[tipo] =
          typeof valor === "number"
            ? valor
            : typeof valor === "object" && valor !== null
            ? Object.values(valor).reduce(
                (sum: number, v: any) => sum + Number(v || 0),
                0
              )
            : 0;
      });

      return row;
    })
  );

  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{year}</p>
      <CardHeader>
        <CardTitle className="dark:text-gray-100">
          Ocorrências por Transportadora
        </CardTitle>
      </CardHeader>

      <ResponsiveContainer width="100%" height={300}>
        <ChartContainer config={{}}>
          <BarChart
            data={chartData}
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

            <YAxis
              stroke="oklch(0.55 0.015 240)"
              fontSize={12}
              tickFormatter={(value) => `${(value * 10).toFixed(0)}%`}
            />

            <Tooltip
              wrapperStyle={{ pointerEvents: "auto" }}
              cursor={{ fill: "oklch(0.55 0.015 240)" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;

                const { month, transportadoras } = payload[0].payload;

                if (
                  !transportadoras ||
                  Object.keys(transportadoras).length === 0
                ) {
                  return null;
                }

                return (
                  <div
                    className="
          w-96 rounded-2xl border border-gray-200 dark:border-white/10
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
          p-5 shadow-2xl
        "
                  >
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between  max-h-[300px] ">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {month}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Ocorrências
                      </span>
                    </div>

                    {/* Transportadoras */}
                    <div
                      className="space-y-4 max-h-[300px] overflow-auto"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      {Object.entries(transportadoras).map(
                        ([transportadora, tipos]: any) => (
                          <div
                            key={transportadora}
                            className="
                  rounded-xl border border-gray-100 dark:border-white/10
                  bg-gray-50/60 dark:bg-white/5 ml-3
                  p-3 m-3
                "
                          >
                            {/* Nome transportadora */}
                            <div className="mb-2 flex items-center gap-2 ">
                              <span
                                className="h-3 w-3 rounded-sm"
                                style={{
                                  backgroundColor:
                                    TYPE_COLORS[
                                      transportadoras
                                        ? Object.keys(transportadoras).indexOf(
                                            transportadora
                                          ) % TYPE_COLORS.length
                                        : 0
                                    ],
                                }}
                              />

                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {transportadora}
                              </p>
                            </div>

                            {/* Tipos */}
                            <div className="space-y-1">
                              {Object.entries(tipos).map(
                                ([tipo, valor]: any) =>
                                  valor > 0 && (
                                    <div
                                      key={tipo}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <span className="text-gray-600 dark:text-gray-300">
                                        {tipo}
                                      </span>

                                      <span
                                        className="
                              px-2 py-0.5 text-xs font-semibold
                              text-gray-800 dark:text-gray-100
                            "
                                      >
                                        {valor}
                                      </span>
                                    </div>
                                  )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              }}
            />

            <Legend />

            {tipos.map((tipo, index) => (
              <Bar
                key={tipo}
                dataKey={tipo}
                fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                barSize={20}
                radius={[4, 4, 0, 0]}
                onMouseMove={(state) => {
                  if (state?.activePayload?.length) {
                    setTooltipData(state.activePayload[0].payload);
                  }
                }}
                onMouseLeave={() => setTooltipData(null)}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
