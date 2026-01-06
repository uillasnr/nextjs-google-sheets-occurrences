"use client";

import React, { useState } from "react";
import { FileText, Download, Loader2, CheckCircle, XCircle } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

import type { Occurrence } from "@/types/occurrence";
import OccurrencePDFDocument from "@/app/components/OccurrencePDFDocument";

interface PDFReportButtonProps {
  occurrences: Occurrence[];
  sheet: "SP" | "PE" | "ES";
}

export default function PDFReportButton({
  occurrences,
  sheet,
}: PDFReportButtonProps) {
  const [showMessage, setShowMessage] = useState(false);

  // Filtrar apenas ocorrências pendentes e em andamento
  const filteredOccurrences = occurrences.filter(
    (occ) =>
      occ.status === "Pendente" ||
      occ.status === "Em Andamento" ||
      occ.status === "Em analise"
  );

  const handleDownloadComplete = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  // Se não houver ocorrências, mostrar botão desabilitado
  if (filteredOccurrences.length === 0) {
    return (
      <div className="space-y-2">
        <button
          disabled
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
            bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500
            cursor-not-allowed opacity-60 transition-colors shadow-md text-sm"
        >
          <FileText className="w-5 h-5" />
          <span>Gerar Relatório PDF</span>
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
          Nenhuma ocorrência pendente ou em andamento
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <PDFDownloadLink
        document={
          <OccurrencePDFDocument
            occurrences={filteredOccurrences}
            sheet={sheet}
          />
        }
        fileName={`Relatorio_Ocorrencias_${sheet}_${
          new Date().toISOString().split("T")[0]
        }.pdf`}
        className="w-full"
      >
        {({ loading, error }) => (
          <button
            onClick={() => !loading && handleDownloadComplete()}
            disabled={loading}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg w-full
              border border-gray-300 dark:border-gray-700
              bg-gray-200 dark:bg-gray-800
              hover:bg-gray-300 dark:hover:bg-gray-700
              transition-colors shadow-md text-sm dark:text-white
              ${loading ? "cursor-wait opacity-70" : ""}
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gerando PDF...</span>
              </>
            ) : error ? (
              <>
                <XCircle className="w-5 h-5" />
                <span>Erro ao gerar</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Gerar Relatório PDF</span>
              </>
            )}
          </button>
        )}
      </PDFDownloadLink>

      {/* Informação sobre quantidade */}
      <div className="flex items-center justify-between px-2 text-xs">
        <span className="text-gray-500 dark:text-gray-400 ">
          {filteredOccurrences.length}{" "}
          {filteredOccurrences.length === 1 ? "ocorrência em andamento." : "ocorrências em andamento."}
        </span>
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          Filial {sheet}
        </span>
      </div>

      {/* Mensagem de sucesso */}
      {showMessage && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg
          bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800
          text-green-800 dark:text-green-300 text-xs animate-in fade-in slide-in-from-top-2"
        >
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Download iniciado com sucesso!</span>
        </div>
      )}
    </div>
  );
}