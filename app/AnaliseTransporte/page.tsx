"use client";

import { useEffect, useState } from "react";
import type { Transporte } from "@/types/transporte";
import { useTransporteMetrics } from "@/lib/useTransporteMetrics";
import Loading from "@/components/Loading";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  Moon,
  Sun,
  Filter,
  Truck,
  Package,
  CheckCircle2,
  Clock,
} from "lucide-react";
import AnaliseHeader from "./componete/AnaliseHeader";
import { TabelaDetalhada } from "./componete/TabelaDetalhada";
import MediaFreteEstadoChart from "./componete/MediaFreteEstadoChart";

function parseDateBR(dateStr?: string) {
  if (!dateStr) return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return new Date(dateStr);

  const [day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`);
}

export default function AnaliseTransporte() {
  const [data, setData] = useState<Transporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState("janeiro");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [filialFiltro, setFilialFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [dark, setDark] = useState(false);
  const [kpiFiltro, setKpiFiltro] = useState("");
  const [cnpjFiltro, setCnpjFiltro] = useState("");

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
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro API:", err);
        setData([]);
        setLoading(false);
      });
  }, []);

  const remetentesUnicos = Array.from(
    new Set(data.map((d) => d.cnpjRemetente).filter(Boolean))
  ).sort();

  // DARK MODE
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // FILTROS
  let filtrado = data.filter((d) => (d.mes || "").toLowerCase() === mes);

  if (estadoFiltro) {
    filtrado = filtrado.filter((d) => d.ufDestino === estadoFiltro);
  }

  if (filialFiltro) {
    filtrado = filtrado.filter((d) => d.filialOrigem === filialFiltro);
  }

  if (statusFiltro) {
    filtrado = filtrado.filter((d) => d.status === statusFiltro);
  }

  // 🔥 FILTRO POR KPI
  if (kpiFiltro === "FINALIZADO") {
    filtrado = filtrado.filter((d) => d.status === "FINALIZADO");
  }

  if (kpiFiltro === "ANDAMENTO") {
    filtrado = filtrado.filter(
      (d) => d.status !== "FINALIZADO" && d.dataOcorrencia
    );
  }

  if (kpiFiltro === "ABERTO") {
    filtrado = filtrado.filter(
      (d) => !d.dataOcorrencia && d.status !== "FINALIZADO"
    );
  }
  if (kpiFiltro === "ATRASADAS") {
    filtrado = filtrado.filter((d) => calcularAtraso(d) > 0);
  }

  if (cnpjFiltro) {
    filtrado = filtrado.filter((d) => d.cnpjRemetente === cnpjFiltro);
  }

  // 🔥 MÉTRICAS AVANÇADAS
  const metrics = useTransporteMetrics(filtrado);

  // 📊 DISTRIBUIÇÃO POR ESTADO (ordenado maior para menor)
  const estadosMap: Record<string, number> = {};
  filtrado.forEach((item) => {
    const uf = item.ufDestino || "N/A";
    estadosMap[uf] = (estadosMap[uf] || 0) + 1;
  });

  const estadosData = Object.entries(estadosMap)
    .map(([uf, value]) => ({ uf, value }))
    .sort((a, b) => b.value - a.value);

  // 📊 EFICIÊNCIA (No Prazo vs Atrasadas)
  const eficienciaData = [
    { name: "No Prazo", value: parseFloat(metrics.eficiencia) },
    { name: "Atrasadas", value: 100 - parseFloat(metrics.eficiencia) },
  ];

  // 📊 STATUS DE DESPACHO
  const statusMap: Record<string, number> = {};
  filtrado.forEach((item) => {
    const status = item.status || "Sem status";
    statusMap[status] = (statusMap[status] || 0) + 1;
  });

  const statusData = Object.entries(statusMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // FILTROS ÚNICOS
  const estadosUnicos = Array.from(
    new Set(data.map((d) => d.ufDestino).filter(Boolean))
  ).sort();
  const filiaisUnicas = Array.from(
    new Set(data.map((d) => d.filialOrigem).filter(Boolean))
  ).sort();
  const statusUnicos = Array.from(
    new Set(data.map((d) => d.status).filter(Boolean))
  ).sort();

  function calcularAtraso(item: Transporte) {
    const dataPrev = parseDateBR(item.previsaoEntrega);
    const dataReal = parseDateBR(item.dataOcorrencia);

    if (!dataPrev || !dataReal) return 0;

    const diff =
      (dataReal.getTime() - dataPrev.getTime()) / (1000 * 60 * 60 * 24);

    return diff > 0 ? Math.ceil(diff) : 0;
  }

  const notasAtrasadas = filtrado.filter((d) => calcularAtraso(d) > 0).length;

  return (
    <div className="min-h-screen  bg-gray-200/40 dark:bg-gray-950/95 transition-colors ">
      <Loading isOpen={loading} text="Carregando Dados de Transporte" />
      {/* HEADER */}

      <AnaliseHeader
        mes={mes}
        setMes={setMes}
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        filialFiltro={filialFiltro}
        setFilialFiltro={setFilialFiltro}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
        estados={estadosUnicos}
        filiais={filiaisUnicas}
        statusList={statusUnicos}
        dark={dark}
        setDark={setDark}
        remetenteFiltro={cnpjFiltro}
        setRemetenteFiltro={setCnpjFiltro}
        remetentes={remetentesUnicos}
      />

      <div className="px-6">
        {/* KPI PRINCIPAIS */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Kpi
            title="Total Frete"
            value={`R$ ${metrics.totalFrete.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            icon={<Package className="w-5 h-5 text-brand-primary" />}
          />
          <Kpi
            title="Total Entregas"
            value={metrics.totalEntregas}
            icon={<Truck className="w-5 h-5 text-brand-secondary" />}
          />
          <Kpi
            title="Finalizadas"
            value={metrics.finalizadas}
            /*  highlight */
            icon={
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            }
            active={kpiFiltro === "FINALIZADO"}
            onClick={() =>
              setKpiFiltro(kpiFiltro === "FINALIZADO" ? "" : "FINALIZADO")
            }
          />
          <Kpi
            title="Em Andamento"
            value={metrics.emAndamento}
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            active={kpiFiltro === "ANDAMENTO"}
            onClick={() =>
              setKpiFiltro(kpiFiltro === "ANDAMENTO" ? "" : "ANDAMENTO")
            }
          />
          <Kpi
            title="Notas Atrasadas"
            value={notasAtrasadas}
            icon={<Clock className="w-5 h-5 text-red-500" />}
            active={kpiFiltro === "ATRASADAS"}
            onClick={() =>
              setKpiFiltro(kpiFiltro === "ATRASADAS" ? "" : "ATRASADAS")
            }
          />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <Kpi
            title="Tempo Médio (dias)"
            value={`${metrics.tempoMedio} dias`}
            icon={<Clock className="w-5 h-5 text-blue-500" />}
          />
          <Kpi
            title="Eficiência"
            value={`${metrics.eficiencia}%`}
            type="success"
            icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          />
          <Kpi
            title="Atraso Médio"
            value={`${metrics.atrasoMedio} dias`}
            type="error"
            icon={<Clock className="w-5 h-5 text-status-error" />}
          />
          <Kpi
            title="Maior Atraso"
            value={`${metrics.maiorAtraso} dias`}
            type="error"
            icon={<Clock className="w-5 h-5 text-status-error" />}
          />
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* BARRAS - ENTREGAS POR ESTADO */}
          <Card title="Entregas por Estado (UF Destino)">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={estadosData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.25 0.012 240)"
                />
                <XAxis
                  dataKey="uf"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={10}
                  angle={0}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: "oklch(0.55 0.015 240)", fontSize: 12 }}
                />
                <YAxis
                  width={30}
                  tick={{ fill: "oklch(0.55 0.015 240)", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value} entregas`, "Total"]}
                  contentStyle={{
                    backgroundColor: "var(--card-dark)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="value"
                  isAnimationActive
                  animationDuration={600}
                  animationEasing="ease-out"
                  fill="oklch(0.65 0.24 264)"
                  markerStart="10"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* PIZZA - EFICIÊNCIA */}
          <Card title="Eficiência de Entregas">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={eficienciaData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="oklch(0.65 0.24 264)" // 👈 cor da borda
                  strokeWidth={2} // 👈 espessura
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  fontSize={12}
                >
                  <Cell fill="oklch(0.65 0.24 264)" />
                  <Cell fill="#EF4444" stroke="#EF4444" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    /*    backgroundColor: "oklch(0.55 0.015 240)", */
                    border: "1px solid oklch(0.55 0.015 240)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* BARRAS - STATUS DE DESPACHO */}
          <Card title="Status de Despacho">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={statusData}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "oklch(0.55 0.015 240)", fontSize: 12 }}
                />
                <YAxis
                  width={30}
                  tick={{ fill: "oklch(0.55 0.015 240)", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, "Total"]}
                  contentStyle={{
                    backgroundColor: "var(--card-dark)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" fill="oklch(0.65 0.24 264)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <MediaFreteEstadoChart data={filtrado} />

        {/* INSIGHTS AUTOMÁTICOS */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <InsightCard
            title="Estados com Maior Volume"
            items={estadosData
              .slice(0, 3)
              .map((item) => `${item.uf}: ${item.value} entregas`)}
            type="info"
          />
          <InsightCard
            title="Estados com Maior Atraso"
            items={metrics.topEstados
              .slice(0, 3)
              .map((item) => `${item.name}: ${item.value} atrasos`)}
            type="error"
          />
          <InsightCard
            title="Status de Despacho"
            items={statusData
              .slice(0, 3)
              .map((item) => `${item.name}: ${item.value}`)}
            type="warning"
          />
        </div>

        {/* TABELA DETALHADA */}
        <Card title="Dados Detalhados">
          <TabelaDetalhada dados={filtrado} />
        </Card>
      </div>
    </div>
  );
}

function Kpi({ title, value, highlight, type, icon, onClick, active }: any) {
  const colorMap: any = {
    success: "text-status-success",
    error: "text-status-error",
    warning: "text-status-warning",
    info: "text-status-info",
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-card border shadow-card text-center transition-colors 
        ${active ? "ring-2 ring-blue-500 scale-105" : ""}
        ${
          highlight
            ? "dark:bg-gray-800/50 text-black shadow-glow"
            : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:shadow-card-hover"
        }`}
    >
      <div className="flex items-center justify-center gap-2 mb-2 text-gray-500 dark:text-text-secondary">
        {icon}
        <p className="text-xs font-semibold">{title}</p>
      </div>
      <p
        className={`text-xl font-bold ${
          colorMap[type] || "text-gray-800 dark:text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-card-border p-5 rounded-card shadow-card hover:shadow-card-hover transition-shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-text-secondary">
        {title}
      </h2>
      {children}
    </div>
  );
}

function InsightCard({ title, items, type }: any) {
  const colorMap: any = {
    success: "border-status-success bg-status-success/10",
    error: "border-status-error bg-status-error/10",
    warning: "border-status-warning bg-status-warning/10",
    info: "border-status-info bg-status-info/10",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-card transition-colors ${
        colorMap[type] || "border-gray-300 bg-gray-50 dark:bg-card-dark"
      }`}
    >
      <h3 className="font-semibold text-gray-800 dark:text-text-primary mb-2">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item: string, i: number) => (
          <li
            key={i}
            className="text-sm text-gray-600 dark:text-text-secondary"
          >
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
