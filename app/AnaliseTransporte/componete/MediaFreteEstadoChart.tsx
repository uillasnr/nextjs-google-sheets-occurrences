"use client";

import { useMemo, useState } from "react";
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

type Props = {
  data: Transporte[];
};

type ModoVisao = "participacao" | "comparativo";

export default function RankingFreteInteligente({ data }: Props) {
  const [modo, setModo] = useState<ModoVisao>("participacao");

  // 🔥 CONVERTER VALOR COM TRATAMENTO DE ERRO
  function converterValor(valor: string | number | null | undefined): number {
    if (!valor) return 0;
    if (typeof valor === "number") return valor;

    const texto = String(valor).trim();
    if (texto.includes(",")) {
      return parseFloat(texto.replace(/\./g, "").replace(",", "."));
    }
    return parseFloat(texto) || 0;
  }

  const analytics = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    const estados: Record<string, { totalFrete: number; quantidade: number }> =
      {};

    let totalFreteBrasil = 0;
    let totalEntregasBrasil = 0;

    safeData.forEach((item) => {
      const uf = item.ufDestino || "N/A";
      const valorFrete = converterValor(item.valorFrete);

      if (!estados[uf]) {
        estados[uf] = { totalFrete: 0, quantidade: 0 };
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
        const mediaEstado =
          values.quantidade > 0 ? values.totalFrete / values.quantidade : 0;

        // % de participação sobre o faturamento total nacional
        const percentualParticipacao =
          totalFreteBrasil > 0
            ? (values.totalFrete / totalFreteBrasil) * 100
            : 0;

        // % de desvio em relação à média nacional
        const percentualComparativo =
          mediaNacional > 0
            ? ((mediaEstado - mediaNacional) / mediaNacional) * 100
            : 0;

        // Define o valor numérico que o gráfico vai plotar
        const valorGrafico =
          modo === "participacao"
            ? percentualParticipacao
            : percentualComparativo;

        // 🔥 LÓGICA DE CORES REFINADA (Baseada no desvio da média ou tamanho da participação)
        let color = "#22c55e"; // Verde padrão (dentro do esperado ou abaixo da média)

        if (modo === "comparativo") {
          if (percentualComparativo > 15) color = "#ef4444"; // Vermelho
          else if (percentualComparativo > 5) color = "#f97316"; // Laranja
          else if (percentualComparativo < -15) color = "#3b82f6"; // Azul
        } else {
          if (percentualParticipacao > 10) color = "#ef4444";
          else if (percentualParticipacao > 5) color = "#f97316";
        }

        return {
          uf,
          media: mediaEstado,
          valorGrafico,
          percentualParticipacao,
          percentualComparativo,
          quantidade: values.quantidade,
          totalFrete: values.totalFrete,
          color,
        };
      })
      // Ordena pelo maior valor exibido no momento
      .sort((a, b) => b.valorGrafico - a.valorGrafico);

    return {
      ranking,
      mediaNacional,
      totalFreteBrasil,
      totalEntregasBrasil,
    };
  }, [data, modo]);

  return (
    <div className="space-y-6 mb-6">
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 p-6 shadow-sm">
        {/* HEADER DO COMPONENTE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Ranking de Frete por Estado
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {modo === "participacao"
                ? "Participação percentual de cada estado e custo total do frete."
                : "Desvio percentual do ticket médio do estado em relação à média Total."}
            </p>
          </div>

          {/* CONTROLE DE ALTERNÂNCIA (TOGGLE DOS MODOS) */}
          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 self-start sm:self-center">
            <button
              onClick={() => setModo("participacao")}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                modo === "participacao"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Participação %
            </button>
            <button
              onClick={() => setModo("comparativo")}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                modo === "comparativo"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Comparativo Médio
            </button>
          </div>
        </div>

        {/* LEGENDAS DINÂMICAS */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4">
          {modo === "comparativo" ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />{" "}
                Criticamente Acima (+15%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />{" "}
                Acima da Média
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />{" "}
                Abaixo/Na Média
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Muito
                Abaixo (-15%)
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Alta
                Relevância (+10%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />{" "}
                Média Relevância (+5%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Baixa
                Participação (-10%)
              </span>
            </>
          )}
        </div>

        {/* CONTAINER DO GRÁFICO */}
        <div className="w-100 h-[180px]">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={analytics.ranking}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(120,120,120,0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="uf"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
              />

              <Tooltip
                cursor={{ fill: "rgba(120,120,120,0.05)" }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  const item = payload[0].payload;

                  return (
                    <div className="rounded-2xl border  border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-xl min-w-[260px] space-y-3">
                      {/* Estado e Entregas */}
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {item.uf}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {item.quantidade} entregas
                          </p>
                        </div>
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>

                      {/* Informações de Ticket Médio */}
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">
                          Ticket Médio do Estado
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {item.media.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>

                      {/* Métricas Dinâmicas do Modo ativo */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                          <p className="text-[10px] text-gray-400 uppercase font-semibold">
                            Participação
                          </p>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {item.percentualParticipacao.toFixed(2)}%
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                          <p className="text-[10px] text-gray-400 uppercase font-semibold">
                            Vs. Média Tot.
                          </p>
                          <p
                            className={`text-sm font-bold ${
                              item.percentualComparativo >= 0
                                ? "text-orange-500"
                                : "text-green-500"
                            }`}
                          >
                            {item.percentualComparativo >= 0 ? "+" : ""}
                            {item.percentualComparativo.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* Total Acumulado */}
                      <div className="pt-1 text-xs text-gray-400 flex justify-between">
                        <span>Total gasto: </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {item.totalFrete.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />

              {/* BARRA DO GRÁFICO - MAPEANDO DINAMICAMENTE O VALOR DO MODO */}
              <Bar dataKey="valorGrafico" radius={[6, 6, 0, 0]}>
                {analytics.ranking.map((item, index) => (
                  <Cell key={`cell-${index}`} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
