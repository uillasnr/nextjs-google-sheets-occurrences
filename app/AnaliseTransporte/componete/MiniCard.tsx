"use client";

export default function MiniCard({ title, value, type }: any) {
  const colors: any = {
    success: "text-status-success",
    error: "text-status-error",
    pending: "text-status-pending",
    info: "text-status-info",
  };

  return (
    <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-4 rounded-card text-center">
      <p className="text-xs text-gray-500 dark:text-text-secondary">{title}</p>
      <p className={`text-xl font-bold ${colors[type]}`}>{value}</p>
    </div>
  );
}
