export default function InfoBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
}
