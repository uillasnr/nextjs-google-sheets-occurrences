"use client";

import { useMemo } from "react";
import type { Transporte } from "@/types/transporte";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { TrendingUp, TrendingDown, BadgeDollarSign } from "lucide-react";

type Props = {
  data: Transporte[];
};

export default function RankingFreteInteligente({ data }: Props) {
  const analytics = useMemo(() => {
    const estados: Record<
      string,
      {
        totalFrete: number;
        quantidade: number;
      }
    > = {};

    let totalFreteBrasil = 0;
    let totalEntregasBrasil = 0;

    data.forEach((item) => {
      const uf = item.ufDestino || "N/A";

      const frete = parseFloat(
        String(item.valorFrete || "0")
          .replace(/\./g, "")
          .replace(",", ".")
      );

      const valorFrete = isNaN(frete) ? 0 : frete;

      if (!estados[uf]) {
        estados[uf] = {
          totalFrete: 0,
          quantidade: 0,
        };
      }

      estados[uf].totalFrete += valorFrete;
      estados[uf].quantidade += 1;

      totalFreteBrasil += valorFrete;
      totalEntregasBrasil += 1;
    });

    const mediaNacional =
      totalEntregasBrasil > 0 ? totalFreteBrasil / totalEntregasBrasil : 0;

    const ranking = Object.entries(estados)
      .map(([uf, values]) => {
        const media = values.totalFrete / values.quantidade;

        const percentual =
          mediaNacional > 0
            ? ((media - mediaNacional) / mediaNacional) * 100
            : 0;

        const acimaMedia = percentual > 0;

        return {
          uf,
          media,
          percentual,
          quantidade: values.quantidade,
          totalFrete: values.totalFrete,
          status: acimaMedia
            ? `${percentual.toFixed(1)}% acima da média`
            : `${Math.abs(percentual).toFixed(1)}% abaixo da média`,
          color:
            percentual > 40
              ? "#ef4444"
              : percentual > 0
              ? "#f97316"
              : "#22c55e",
        };
      })
      .sort((a, b) => b.media - a.media);

    return {
      ranking,
      mediaNacional,
      totalEntregasBrasil,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* KPIs CLEAN / PREMIUM */}
      {/*   <div className="grid grid-cols-1 md:grid-cols-3 gap-5"> */}
      {/* CARD 1 */}
      {/*  <div className="group relative overflow-hidden rounded-[28px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"> */}
      {/* TOP */}
      {/*  <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ticket Médio Nacional
              </p>

              <div className="flex items-end gap-2">
                <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                  R$
                </h2>

                <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                  {analytics.mediaNacional.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h1>
              </div>
            </div> */}

      {/* ICON */}
      {/*  <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-all" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500 text-white">
                <BadgeDollarSign className="w-8 h-8" />
              </div>
            </div>
          </div> */}

      {/* BOTTOM */}
      {/*  <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />

              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Média logística nacional
              </span>
            </div>

            <div className="rounded-full bg-blue-50 dark:bg-blue-950/30 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              Financeiro
            </div>
          </div>
        </div> */}

      {/* CARD 2 */}
      {/*   <div className="group relative overflow-hidden rounded-[28px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Entregas Analisadas
              </p>

              <div className="flex items-end gap-2">
                <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                  {analytics.totalEntregasBrasil}
                </h1>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-green-500 blur-xl opacity-20 group-hover:opacity-40 transition-all" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500 text-white">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div> */}

      {/* MINI BARS */}
      {/*   <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Monitoramento</span>

              <span className="font-semibold text-green-500">100%</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="h-full w-full rounded-full bg-green-500" />
            </div>
          </div>
        </div> */}

      {/* CARD 3 */}
      {/*  <div className="group relative overflow-hidden rounded-[28px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Estados Monitorados
              </p>

              <div className="flex items-end gap-2">
                <h1 className="text-lg  font-black tracking-tight text-gray-900 dark:text-white">
                  {analytics.ranking.length}
                </h1>

                <span className="mb-2 text-lg font-semibold text-gray-400">
                  UFs
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-orange-500 blur-xl opacity-20 group-hover:opacity-40 transition-all" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500 text-white">
                <TrendingDown className="w-8 h-8" />
              </div>
            </div>
          </div> */}

      {/* FOOTER */}
      {/*   <div className="mt-8 flex items-center justify-between rounded-2xl bg-orange-50 dark:bg-orange-950/20 p-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cobertura nacional
              </p>

              <h3 className="text-sm font-bold text-orange-500">
                Dados ativos
              </h3>
            </div>

            <div className="h-3 w-3 rounded-full bg-orange-500 animate-pulse" />
          </div>
        </div>
      </div> */}
      {/* GRÁFICO */}
      <div className="mb-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ranking de Frete por Estado
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Comparativo do ticket médio de frete.
          </p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.ranking}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(120,120,120,0.12)"
            />

            <XAxis
              dataKey="uf"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 13 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              width={30}
              tickFormatter={(value) =>
                `R$ ${Number(value).toLocaleString("pt-BR")}`
              }
            />

            <Tooltip
              cursor={{
                fill: "rgba(120,120,120,0.08)",
              }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) {
                  return null;
                }

                const item = payload[0].payload;

                return (
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-2xl min-w-[280px]">
                    {/* UF */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {item.uf}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {item.quantidade} entregas analisadas
                        </p>
                      </div>

                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />
                    </div>

                    {/* VALOR */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">
                        Média do estado Frete
                      </p>

                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        R${" "}
                        {item.media.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </h2>
                    </div>

                    {/* PERCENTUAL */}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`text-lg font-bold ${
                          item.percentual > 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {item.percentual > 0 ? "+" : ""}
                        {item.percentual.toFixed(1)}%
                      </span>

                      <span className="text-sm text-gray-500">
                        {item.percentual > 0
                          ? "Acima da média"
                          : "Abaixo da média"}
                      </span>
                    </div>

                    {/* MÉDIA BRASIL */}
                    <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-3">
                      <p className="text-xs text-gray-500 mb-1">Média Mês</p>

                      <p className="font-semibold text-gray-900 dark:text-white">
                        R${" "}
                        {analytics.mediaNacional.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    {/* STATUS */}
                    {/*      <div className="mt-4 text-sm">
                      <span
                        className={`font-semibold ${
                          item.percentual > 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div> */}

                    <p className="text-xs text-gray-500 mb-1 mt-2">
                      Total gasto no estado
                    </p>

                    <p className="font-bold text-gray-900 dark:text-white">
                      R${" "}
                      {item.totalFrete.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                );
              }}
            />

            <Bar dataKey="media" radius={[12, 12, 0, 0]}>
              {analytics.ranking.map((item, index) => (
                <Cell key={index} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
