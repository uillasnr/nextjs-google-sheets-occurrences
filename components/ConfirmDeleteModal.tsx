"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    password: string,
    setError: (msg: string) => void
  ) => void;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Resetar estado ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Excluir ocorrência
            </h2>
          </div>

          <button onClick={onClose} aria-label="Fechar">
            <X className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Texto */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Esta ação é <strong>irreversível</strong> e não poderá ser desfeita.
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Para continuar, informe a senha de autorização.
        </p>

        {/* Input */}
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="Senha de autorização"
          className="w-full mb-2 px-3 py-2 text-sm rounded-lg border dark:border-gray-700
                     dark:bg-gray-900 dark:text-white focus:outline-none
                     focus:ring-2 focus:ring-red-500"
        />

        {/* Erro */}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-2">
            {error}
          </p>
        )}

        {/* Ações */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-lg text-sm
                       bg-gray-200 hover:bg-gray-300
                       dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              if (!password) {
                setError("Informe a senha de autorização para continuar.");
                return;
              }

              onConfirm(password, setError);
            }}
            className="flex-1 px-3 py-2 rounded-lg text-sm text-white
                       bg-red-600 hover:bg-red-700 transition-colors"
          >
            Excluir ocorrência
          </button>
        </div>
      </div>
    </div>
  );
}
