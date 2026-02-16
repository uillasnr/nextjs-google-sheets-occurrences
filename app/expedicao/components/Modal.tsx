export default function Modal({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md  relative">
        
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-black"
          >
            ✕
          </button>
        )}

        <h2 className="text-lg m-0 font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm mb-5 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
