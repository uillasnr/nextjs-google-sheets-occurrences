"use client";

import type { Transporte } from "@/types/transporte";

function parseDateBR(dateStr?: string) {
  if (!dateStr) return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`);
}

function diffDays(d1: Date, d2: Date) {
  return (d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
}

function getTop(obj: Record<string, number>, limit = 5) {
  return Object.entries(obj)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function useTransporteMetrics(data?: Transporte[]) {
  // ✅ proteção contra undefined
  if (!data || !Array.isArray(data)) {
    return {
      totalFrete: 0,
      tempoMedio: "0",
      sla: "0",
      atrasoMedio: "0",
      maiorAtraso: 0,
      topEstados: [],
      topCidades: [],
      topRotas: [],
    };
  }

  let totalFrete = 0;
  let totalDias = 0;
  let countEntrega = 0;
  let dentroPrazo = 0;
  let totalAtraso = 0;
  let totalEntregasAtrasadas = 0;
  let maiorAtraso = 0;

  const atrasoEstado: Record<string, number> = {};
  const atrasoCidade: Record<string, number> = {};
  const atrasoRota: Record<string, number> = {};

  data.forEach((item) => {
    const entrega = parseDateBR(item.dataOcorrencia);
    const previsao = parseDateBR(item.previsaoEntrega);
    const emissao = parseDateBR(item.dataEmissao);

    // 💰 VALOR FRETE
    const frete = parseFloat(
      String(item.valorFrete || "0")
        .replace(/\./g, "")
        .replace(",", ".")
    );

    if (!isNaN(frete)) totalFrete += frete;

    if (entrega && previsao) {
      const diff = diffDays(entrega, previsao);

      // ⏱️ LEAD TIME
      if (emissao) {
        totalDias += diffDays(entrega, emissao);
        countEntrega++;
      }

      // SLA
      if (diff <= 0) {
        dentroPrazo++;
      }

      // 🚨 ATRASO
      if (diff > 0) {
        totalAtraso += diff;
        totalEntregasAtrasadas++;

        if (diff > maiorAtraso) {
          maiorAtraso = diff;
        }

        const uf = item.ufDestino || "N/A";
        const cidade = item.cidadeDestino || "N/A";
        const rota = `${item.cidadeOrigem || "?"} → ${
          item.cidadeDestino || "?"
        }`;

        atrasoEstado[uf] = (atrasoEstado[uf] || 0) + 1;
        atrasoCidade[cidade] = (atrasoCidade[cidade] || 0) + 1;
        atrasoRota[rota] = (atrasoRota[rota] || 0) + 1;
      }
    }
  });

  return {
    // 💰 FINANCEIRO
    totalFrete,

    // ⏱️ TEMPO
    tempoMedio: countEntrega ? (totalDias / countEntrega).toFixed(1) : "0",

    // 📊 SLA
    sla: data.length ? ((dentroPrazo / data.length) * 100).toFixed(1) : "0",

    // 🚨 ATRASO
    atrasoMedio: totalEntregasAtrasadas
      ? (totalAtraso / totalEntregasAtrasadas).toFixed(1)
      : "0",

    maiorAtraso,

    // 🏆 RANKINGS
    topEstados: getTop(atrasoEstado),
    topCidades: getTop(atrasoCidade),
    topRotas: getTop(atrasoRota),
  };
}
