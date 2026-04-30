"use client";

export default function RankingCard({ title, data }: any) {
  return (
    <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-5 rounded-card shadow-card">
      <h2 className="text-sm font-semibold mb-4">{title}</h2>

      <div className="space-y-3">
        {data.map((item: any, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{item.name}</span>
            <span className="font-bold text-status-error">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
