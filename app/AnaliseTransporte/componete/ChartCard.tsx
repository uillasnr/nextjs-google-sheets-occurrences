"use client";

export default function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-5 rounded-card shadow-card">
      <h2 className="text-sm font-semibold mb-4 text-gray-700 dark:text-text-secondary">
        {title}
      </h2>
      {children}
    </div>
  );
}
