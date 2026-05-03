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
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState("janeiro");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [filialFiltro, setFilialFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
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
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro API:", err);
        setData([]);
        setLoading(false);
      });
  }, []);

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
    new Set(data.map((d) => d.ufDestino).filter(Boolean)),
  ).sort();
  const filiaisUnicas = Array.from(
    new Set(data.map((d) => d.filialOrigem).filter(Boolean)),
  ).sort();
  const statusUnicos = Array.from(
    new Set(data.map((d) => d.status).filter(Boolean)),
  ).sort();

  return (
    <div className="min-h-screen  bg-gray-200/40 dark:bg-gray-950/95 transition-colors p-6">
      <Loading isOpen={loading} text="Carregando Dados de Transporte" />
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="inline-flex items-center gap-3 mb-2">
            <Truck className="w-6 h-6 text-brand-primary" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-text-primary">
              Dashboard Logístico de Transporte
            </h1>
          </div>
          <p className="text-gray-600 dark:text-text-secondary">
            Análise completa de performance, custos e eficiência operacional
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-text-secondary">
            <Filter className="w-5 h-5 text-brand-primary" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="bg-white dark:bg-input-bg border border-gray-300 dark:border-input-border px-3 py-2 rounded-input text-sm text-gray-800 dark:text-input-text"
          >
            {meses.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="bg-white dark:bg-input-bg border border-gray-300 dark:border-input-border px-3 py-2 rounded-input text-sm text-gray-800 dark:text-input-text"
          >
            <option value="">Todos Estados</option>
            {estadosUnicos.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>

          <select
            value={filialFiltro}
            onChange={(e) => setFilialFiltro(e.target.value)}
            className="bg-white dark:bg-input-bg border border-gray-300 dark:border-input-border px-3 py-2 rounded-input text-sm text-gray-800 dark:text-input-text"
          >
            <option value="">Todas Filiais</option>
            {filiaisUnicas.map((filial) => (
              <option key={filial} value={filial}>
                {filial}
              </option>
            ))}
          </select>

          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="bg-white dark:bg-input-bg border border-gray-300 dark:border-input-border px-3 py-2 rounded-input text-sm text-gray-800 dark:text-input-text"
          >
            <option value="">Todos Status</option>
            {statusUnicos.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-white dark:bg-card-dark border border-gray-300 dark:border-card-border hover:bg-gray-50 dark:hover:bg-card-darker transition-colors"
          >
            {dark ? (
              <Sun size={18} className="text-text-primary" />
            ) : (
              <Moon size={18} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* KPI PRINCIPAIS */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Kpi
          title="Total Frete"
          value={`R$ ${metrics.totalFrete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
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
          highlight
          icon={
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          }
        />
        <Kpi
          title="Em Andamento"
          value={metrics.emAndamento}
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <Kpi
          title="Em Aberto"
          value={metrics.emAberto}
          icon={<Package className="w-5 h-5 text-status-pending" />}
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estadosData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0.012 240)"
              />
              <XAxis
                dataKey="uf"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: "oklch(0.55 0.015 240)", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "oklch(0.55 0.015 240)", fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value} entregas`, "Total"]}
                contentStyle={{
                  backgroundColor: "var(--card-dark)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "8px",
                  color: "oklch(0.55 0.015 240)",
                }}
              />
              <Bar
                dataKey="value"
                isAnimationActive
                animationDuration={600}
                animationEasing="ease-out"
                fill="oklch(0.65 0.24 264)"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* PIZZA - EFICIÊNCIA */}
        <Card title="Eficiência de Entregas">
          <ResponsiveContainer width="100%" height={300}>
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
              >
                <Cell fill="oklch(0.65 0.24 264)" />
                <Cell fill="#EF4444" stroke="#EF4444" />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.55 0.015 240)",
                  border: "1px solid oklch(0.55 0.015 240)",
                  borderRadius: "8px",
                  color: "oklch(0.65 0.24 264)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* BARRAS - STATUS DE DESPACHO */}
        <Card title="Status de Despacho">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: "oklch(0.55 0.015 240)", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "oklch(0.55 0.015 240)", fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value}`, "Total"]}
                contentStyle={{
                  backgroundColor: "var(--card-dark)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "8px",
                  color: "oklch(0.55 0.015 240)",
                }}
              />
              <Bar dataKey="value" fill="oklch(0.65 0.24 264)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-card-border">
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  NF
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  Cliente
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  UF Destino
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  Cidade
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  Status
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  Frete
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  Mercadoria
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  Emissão
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  Previsão
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
                  Ocorrência
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrado.slice(0, 50).map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-card-border hover:bg-gray-50 dark:hover:bg-card-darker transition-colors"
                >
                  <td className="p-2 text-gray-800 dark:text-text-primary">
                    {item.notaFiscal}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-text-primary">
                    {item.destinatario}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-text-primary">
                    {item.ufDestino}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-text-primary">
                    {item.cidadeDestino}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "FINALIZADO"
                          ? "bg-status-success/20 text-status-success border border-status-success/30"
                          : "bg-status-pending/20 text-status-pending border border-status-pending/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2 text-gray-800 dark:text-text-primary">
                    R$ {item.valorFrete}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-text-primary">
                    R$ {item.valorMercadoria}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-text-primary">
                    {item.dataEmissao}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-text-primary">
                    {item.previsaoEntrega}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-text-primary">
                    {item.dataOcorrencia}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrado.length > 50 && (
            <p className="text-sm text-gray-500 dark:text-text-secondary mt-2">
              Mostrando 50 de {filtrado.length} registros
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

function Kpi({ title, value, highlight, type, icon }: any) {
  const colorMap: any = {
    success: "text-status-success",
    error: "text-status-error",
    warning: "text-status-warning",
    info: "text-status-info",
  };

  return (
    <div
      className={`p-4 rounded-card border shadow-card text-center transition-colors ${
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
        className={`text-xl font-bold ${colorMap[type] || "text-gray-800 dark:text-text-primary"}`}
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
      className={`border-l-4 p-4 rounded-card transition-colors ${colorMap[type] || "border-gray-300 bg-gray-50 dark:bg-card-dark"}`}
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
