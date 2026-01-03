"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import type { Occurrence } from "@/types/occurrence";
import OccurrenceCard from "./OccurrenceCard";

interface Props {
  isOpen: boolean;
  occurrence: Occurrence | null;
  onClose: () => void;
  onEdit: (item: Occurrence) => void;
  onDelete: (id: string) => void;
}

export default function SearchResultModal({
  isOpen,
  occurrence,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  // 🔹 Fecha com ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !occurrence) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl mx-4 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="items-center flex justify-center flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Resultado da busca
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="px-32 ">
            <OccurrenceCard
              item={occurrence}
              onEdit={(item) => {
                onEdit(item);
                onClose(); // opcional: fecha o modal após clicar em editar
              }}
              onDelete={(id) => {
                onDelete(id);
                onClose(); // opcional
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-800"></div>
      </div>
    </div>
  );
}
