export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800  p-6 rounded-xl w-full max-w-md space-y-4 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-black"
          >
            ✕
          </button>
        )}
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 ">{title}</h2>
        {children}
      </div>
    </div>
  );
}
