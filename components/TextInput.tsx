import { AlertCircle } from "lucide-react";

interface TextInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  min?: number | string;
}

export function TextInput({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder,
  type = "text",
  disabled,
  min,
}: TextInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-status-error">*</span>}
      </label>

      <input
        name={name}
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`
  w-full p-3 rounded-lg border transition-all
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  bg-gray-100 text-gray-900
  dark:bg-gray-900 dark:text-gray-100

  ${error ? "border-red-500 " : "border-gray-300 dark:border-gray-600 "}

  ${disabled && "cursor-not-allowed opacity-70"}
`}
      />

      {error && (
        <p className="text-status-error focus:ring-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
