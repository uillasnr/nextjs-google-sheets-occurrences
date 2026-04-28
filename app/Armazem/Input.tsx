export default function Input({
  label,
  name,
  icon,
  type = "text",
  value,
  onChange,
}: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">
        {label}
      </label>

      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="
            w-full pl-10 pr-4 py-2.5
            rounded-xl
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900
            text-sm text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500
            focus:border-transparent
            outline-none
            transition-all
            shadow-sm hover:shadow-md
          "
        />
      </div>
    </div>
  );
}
