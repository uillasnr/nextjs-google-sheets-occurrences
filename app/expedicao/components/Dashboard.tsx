"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Expedicao = {
  nota: string | number;
  status: string;
  dataNota: string; // ← DATA VEM DA NOTA
};

export default function DashboardExpedicao({ lista }: { lista: Expedicao[] }) {
  const dadosGrafico = useMemo(() => {
    const meses = [
      "Jan","Fev","Mar","Abr","Mai","Jun",
      "Jul","Ago","Set","Out","Nov","Dez",
    ].map((mes) => ({ mes, total: 0 }));

    lista.forEach((item) => {
      if (!item.dataNota) return;

      const statusOk = item.status?.toUpperCase().trim() === "EXPEDIDO";
      if (!statusOk) return;

      // Converter data BR (dd/mm/yyyy)
      const [dia, mes, ano] = item.dataNota.split("/");
      const data = new Date(`${ano}-${mes}-${dia}`);

      if (isNaN(data.getTime())) return;

      const mesIndex = data.getMonth();

      // ✅ CONTA 1 NOTA
      meses[mesIndex].total += 1;
    });

    return meses;
  }, [lista]);

  if (dadosGrafico.every((m) => m.total === 0)) {
    return (
      <div className="flex h-[180px] items-center justify-center text-gray-500 dark:text-gray-400">
        Nenhuma nota expedida ainda.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm w-full">
      <CardHeader className="text-center">
        <CardTitle className="dark:text-gray-100">
          Notas expedidas por mês
        </CardTitle>
      </CardHeader>

      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={{ total: { label: "Notas" } }}>
            <BarChart
              data={dadosGrafico}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.012 240)" />

              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
              />

              <YAxis width={30} fontSize={12} />

              <Tooltip />

              <Bar
                dataKey="total"
                fill="oklch(0.65 0.24 264)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
