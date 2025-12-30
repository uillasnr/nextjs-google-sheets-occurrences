"use client";

import { useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (nfNumber: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSearch,
}: SearchModalProps) {
  const [nfNumber, setNfNumber] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-100 justify-center bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-4  text-gray-900 dark:text-gray-100">
          {/*   Buscar Ocorrência */}
          Em desenvolvimento
        </h2>

        {/*  <input
          type="text"
          placeholder="Digite o número da NF"
          value={nfNumber}
          onChange={(e) => setNfNumber(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        /> */}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSearch(nfNumber);
              setNfNumber("");
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}
