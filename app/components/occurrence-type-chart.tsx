"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Occurrence } from "@/types/occurrence";
import { groupOccurrencesByType } from "../services/googleSheets/helpers";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  occurrences: Occurrence[];
}

export function OccurrenceTypeChart({ occurrences }: Props) {
  const data = groupOccurrencesByType(occurrences);

  console.log("OccurrenceTypeChart data:", data);
  console.log("Total occurrences:", occurrences.length);
  console.log(
    "Sample tipos:",
    occurrences.slice(0, 5).map((o) => o.tipo)
  );

  // Caso não tenha dados
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div>
      {" "}
      <CardHeader>
        <CardTitle className="dark:text-gray-100">
          Ocorrências por Tipo
        </CardTitle>
      </CardHeader>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.012 240)" />
          <XAxis dataKey="type" stroke="oklch(0.55 0.015 240)" fontSize={12} />
          <YAxis stroke="oklch(0.55 0.015 240)" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.15 0.008 240)",
              border: "1px solid oklch(0.25 0.012 240)",
              borderRadius: "0.5rem",
              color: "oklch(0.95 0.005 240)",
            }}
          />
          <Bar
            dataKey="count"
            fill="oklch(0.65 0.24 264)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
