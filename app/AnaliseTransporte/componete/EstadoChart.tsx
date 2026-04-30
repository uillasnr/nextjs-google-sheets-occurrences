"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function EstadoChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="uf" />
        <Tooltip />
        <Bar dataKey="value" className="fill-brand-secondary" />
      </BarChart>
    </ResponsiveContainer>
  );
}
