import { AlertCircle } from "lucide-react";

interface TextAreaInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export function TextAreaInput({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder,
  rows = 3,
}: TextAreaInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-status-error">*</span>}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`
  w-full p-3 rounded-lg border transition-all
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  bg-gray-100 text-gray-900
  dark:bg-gray-900 dark:text-gray-100

  ${
    error
      ? "border-red-500 focus:ring-2 "
      : "border-gray-300 dark:border-gray-600 focus:ring-2 "
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
