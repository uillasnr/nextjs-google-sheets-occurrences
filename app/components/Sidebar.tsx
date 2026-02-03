"use client";

import { BarChart3, Search, Truck, X, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import SearchModal from "./SearchModal";
import { Occurrence } from "@/types/occurrence";
import PDFReportButton from "@/components/PdfButton";

interface SidebarProps {
  goToHome: () => void;
  goToDashboard: () => void;
  onSearchNF: (nf: string) => boolean;
  occurrences: Occurrence[]; // 👈 NOVO
  sheet: "SP" | "PE" | "ES"; // 👈 NOVO
}

export default function Sidebar({
  goToHome,
  goToDashboard,
  onSearchNF,
  occurrences,
  sheet,
}: SidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (nf: string): boolean => {
    return onSearchNF(nf);
  };

  const ThemeToggle = dynamic(
    () => import("./ThemeToggle").then((mod) => mod.ThemeToggle),
    { ssr: false }
  );

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 
        border-l border-gray-200 dark:border-gray-800 shadow-xl z-40
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex mb-4 bg-gray-200 dark:bg-gray-800 items-center justify-between px-4 py-4 border-b shadow-lg border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Ações
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-4">
          {/* Tela inicial */}
          <button
            onClick={() => {
              goToHome();
              router.push("/");
              setOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg
              bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700
              hover:bg-gray-300 dark:hover:bg-gray-700
              transition-colors shadow-md text-sm dark:text-white"
          >
            <Truck className="w-5 h-5" />
            Tela inicial
          </button>

          {/* Expedição */}
          <button
            onClick={() => {
              router.push("/expedicao");
              setOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg
              bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700
              hover:bg-gray-300 dark:hover:bg-gray-700
              transition-colors shadow-md text-sm dark:text-white"
          >
            <Package className="w-5 h-5" />
            Expedição
          </button>

          {/* Dashboard */}
          <button
            onClick={() => {
              goToDashboard(); // Mostra o Dashboard na página atual
              setOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg
              bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700
              hover:bg-gray-300 dark:hover:bg-gray-700
              transition-colors shadow-md text-sm dark:text-white"
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </button>

          {/* Buscar Ocorrências (opcional) */}
          <button
            onClick={() => {
              setIsSearchOpen(true);
              setOpen(false); // 👈 fecha o sidebar
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg
              bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700
              hover:bg-gray-300 dark:hover:bg-gray-700
              transition-colors shadow-md text-sm dark:text-white"
          >
            <Search className="w-5 h-5" />
            Buscar Ocorrências
          </button>

           {/* 🆕 BOTÃO DE GERAR PDF - DESTAQUE NO TOPO */}
          <div className="pb-4 border-b border-t pt-3 border-gray-200 dark:border-gray-700">
            <PDFReportButton occurrences={occurrences} sheet={sheet} />
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Botão flutuante para abrir */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-1/2 right-0 -translate-y-1/2 h-24
            bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-l-xl
            shadow-lg z-50 transition"
        >
          <BarChart3 className="w-5 h-5" />
        </button>
      )}

      {/* Modal de busca */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={(nf) => {
          const found = handleSearch(nf);

          if (found) {
            setIsSearchOpen(false);
          }

          return found;
        }}
      />
    </>
  );
}
