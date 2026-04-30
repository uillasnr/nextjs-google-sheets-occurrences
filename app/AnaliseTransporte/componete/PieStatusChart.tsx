"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function PieStatusChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value">
          <Cell className="fill-status-success" />
          <Cell className="fill-status-error" />
          <Cell className="fill-status-pending" />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
