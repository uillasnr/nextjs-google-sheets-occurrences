import { AlertCircle } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  options: Option[];
  error?: string;
  required?: boolean;
}

export function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
}: SelectInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-status-error">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
               className={`
  w-full p-3 rounded-lg border transition-all
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  bg-gray-100 text-gray-900
  dark:bg-gray-900 dark:text-gray-100

  ${
    error
      ? "border-red-500 "
      : "border-gray-300 dark:border-gray-600 "
  }


`}
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-status-error text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
