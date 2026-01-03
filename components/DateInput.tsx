import { AlertCircle } from "lucide-react";

interface DateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  max?: string;
}

export function DateInput({
  label,
  name,
  value,
  onChange,
  error,
  required,
  max,
}: DateInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-status-error">*</span>}
      </label>

      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        max={max}
        className={`
          w-full p-3 rounded-lg border transition-all
          bg-gray-100 text-gray-900
          dark:bg-gray-900 dark:text-gray-100
          [color-scheme:dark]

          ${
            error
              ? "border-red-500 "
              : "border-gray-300 dark:border-gray-600 "
          }
        `}
      />

      {error && (
        <p className="text-status-error text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
