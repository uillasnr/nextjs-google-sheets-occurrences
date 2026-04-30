"use client";

import { useEffect, useState } from "react";
import type { Transporte } from "@/types/transporte";
import { useTransporteMetrics } from "@/lib/useTransporteMetrics";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Moon, Sun } from "lucide-react";

const meses = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export default function AnaliseTransporte() {
  const [data, setData] = useState<Transporte[]>([]);
  const [mes, setMes] = useState("janeiro");
  const [dark, setDark] = useState(false);

  // ✅ FETCH SEGURO (NUNCA QUEBRA)
  useEffect(() => {
    fetch("/api/transporte")
      .then((res) => res.json())
      .then((json) => {
        console.log("API DATA:", json);

        if (Array.isArray(json)) {
          setData(json);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Erro API:", err);
        setData([]);
      });
  }, []);

  // DARK MODE
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // FILTRO
  const filtrado = data.filter((d) => (d.mes || "").toLowerCase() === mes);

  // 🔥 MÉTRICAS AVANÇADAS
  const metrics = useTransporteMetrics(filtrado);

  const total = filtrado.length;
  const finalizados = filtrado.filter((d) => d.status === "FINALIZADO").length;

  const pendentes = filtrado.filter((d) => d.status === "PENDENTE").length;

  const emAberto = total - finalizados;

  // 📊 DISTRIBUIÇÃO
  const pieData = [
    { name: "No Prazo", value: Number(metrics.sla) },
    { name: "Atraso", value: 100 - Number(metrics.sla) },
    { name: "Pendentes", value: pendentes },
  ];

  // 📊 TODOS OS ESTADOS (volume total)
  const estadosMap: Record<string, number> = {};

  filtrado.forEach((item) => {
    const uf = item.ufDestino || "N/A";
    estadosMap[uf] = (estadosMap[uf] || 0) + 1;
  });

  const estadosData = Object.entries(estadosMap).map(([uf, value]) => ({
    uf,
    value,
  }));

  return (
    <div className="min-h-screen bg-gray-200/40 dark:bg-gray-950/95 transition-colors p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-text-primary">
            Logistics Performance
          </h1>
          <p className="text-gray-600 dark:text-text-secondary">
            Dashboard de análise de entregas, SLA e performance logística
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="bg-white dark:bg-input-bg border border-gray-300 dark:border-input-border px-3 py-2 rounded-input text-sm"
          >
            {meses.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-white dark:bg-card-dark border border-gray-300 dark:border-card-border"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* KPI PRINCIPAL */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <Kpi title="Total CT-e" value={total} />
        <Kpi title="Finalizados" value={finalizados} highlight />
        <Kpi title="Pendentes" value={pendentes} />
        <Kpi title="Em Aberto" value={emAberto} />
      </div>

      {/* SLA + PERFORMANCE */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <MiniCard title="SLA (%)" value={`${metrics.sla}%`} type="success" />
        <MiniCard title="Lead Time" value={`${metrics.tempoMedio} dias`} />
        <MiniCard
          title="Atraso Médio"
          value={`${metrics.atrasoMedio} dias`}
          type="error"
        />
        <MiniCard
          title="Maior Atraso"
          value={`${metrics.maiorAtraso} dias`}
          type="error"
        />
        <MiniCard
          title="Total Frete"
          value={metrics.totalFrete.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          type="info"
        />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* PIE */}
        <Card title="SLA Distribuição">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value">
                <Cell className="fill-status-success" />
                <Cell className="fill-status-error" />
                <Cell className="fill-status-pending" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* STATUS */}
        <Card title="Status">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: "Finalizados", value: finalizados },
                { name: "Pendentes", value: pendentes },
                { name: "Abertos", value: emAberto },
              ]}
            >
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" className="fill-brand-primary" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* FINANCEIRO */}

        <Card title="Volume por Estado">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={estadosData}>
              <XAxis
                dataKey="uf"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <Tooltip />
              <Bar dataKey="value" className="fill-brand-secondary" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* RANKINGS 🔥 */}
      <div className="grid grid-cols-3 gap-6">
        <Ranking title="Top Estados com Atraso" data={metrics.topEstados} />
        <Ranking title="Top Cidades Problemáticas" data={metrics.topCidades} />
        <Ranking title="Piores Rotas" data={metrics.topRotas} />
      </div>
    </div>
  );
}

function Kpi({ title, value, highlight }: any) {
  return (
    <div
      className={`p-6 rounded-card border shadow-card text-center
      ${
        highlight
          ? "bg-brand-primary text-black shadow-glow"
          : "bg-white dark:bg-card-dark border-gray-200 dark:border-card-border"
      }`}
    >
      <p className="text-sm text-gray-500 dark:text-text-secondary">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function MiniCard({ title, value, type }: any) {
  const colorMap: any = {
    success: "text-status-success",
    error: "text-status-error",
    info: "text-status-info",
  };

  return (
    <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-4 rounded-card text-center">
      <p className="text-xs text-gray-500 dark:text-text-secondary">{title}</p>
      <p className={`text-xl font-bold ${colorMap[type] || ""}`}>{value}</p>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-5 rounded-card shadow-card">
      <h2 className="text-sm font-semibold mb-4 text-gray-700 dark:text-text-secondary">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Ranking({ title, data }: any) {
  return (
    <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-5 rounded-card shadow-card">
      <h2 className="text-sm font-semibold mb-4 text-gray-700 dark:text-text-secondary">
        {title}
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">Sem dados</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item: any, i: number) => (
            <li key={i} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="font-bold text-status-error">{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
