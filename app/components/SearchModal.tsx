"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (nfNumber: string) => boolean;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSearch,
}: SearchModalProps) {
  const [nfNumber, setNfNumber] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setNfNumber("");
      return;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Buscar por Nº da Nota
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-3">
          <input
            type="namber"
            placeholder="NF: 123456"
            value={nfNumber}
            onChange={(e) => {
              setNfNumber(e.target.value);
              setError("");
            }}
            className=" w-full p-3 transition-allpx-3 py-2 rounded-lg border
             placeholder:text-gray-400 dark:placeholder:text-gray-500 
              dark:bg-gray-800   bg-gray-100 text-gray-900
  dark:text-gray-100 border-gray-300 dark:border-gray-600 "
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 ">
          <button
            disabled={!nfNumber.trim()}
            onClick={() => {
              const found = onSearch(nfNumber.trim());

              if (!found) {
                setError("Nenhuma ocorrência encontrada para esta NF.");
                return;
              }

              onClose();
            }}
            className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}
