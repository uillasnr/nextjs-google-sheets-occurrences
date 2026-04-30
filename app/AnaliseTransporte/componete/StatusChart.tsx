"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function StatusChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" className="fill-brand-primary" />
      </BarChart>
    </ResponsiveContainer>
  );
}
