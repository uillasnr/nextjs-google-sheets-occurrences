"use client";

export default function KpiCard({ title, value, highlight }: any) {
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
