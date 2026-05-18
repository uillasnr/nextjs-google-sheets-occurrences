"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { Transporte } from "@/types/transporte";
import { ExternalLink } from "lucide-react";

interface Props {
  dados: Transporte[];
}

// 🔥 Função para converter data BR (dd/mm/yyyy) corretamente
function parseDateBR(dateStr?: string) {
  if (!dateStr) return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return new Date(dateStr);

  const [day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`);
}

export function TabelaDetalhada({ dados }: Props) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [clienteFiltro, setClienteFiltro] = useState("");

  const itensPorPagina = 50;

  // 🔥 FILTRO POR CLIENTE
  const dadosFiltrados = useMemo(() => {
    return dados.filter((item) =>
      item.destinatario?.toLowerCase().includes(clienteFiltro.toLowerCase())
    );
  }, [dados, clienteFiltro]);

  // 🔥 RESETAR PAGINA AO FILTRAR
  useEffect(() => {
    setPaginaAtual(1);
  }, [clienteFiltro]);

  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);

  const dadosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;

    return dadosFiltrados.slice(inicio, inicio + itensPorPagina);
  }, [dadosFiltrados, paginaAtual]);

  function visualizarEncomenda(item: Transporte) {
    if (!item.visualizarEncomenda) return;

    window.open(item.visualizarEncomenda, "_blank");
  }

  return (
    <div className="overflow-x-auto">
      {/* 🔥 FILTRO CLIENTE */}
      <div className=" flex justify-end">
        <input
          type="text"
          placeholder="Filtrar cliente..."
          value={clienteFiltro}
          onChange={(e) => setClienteFiltro(e.target.value)}
          className="
            w-full md:w-80
            px-4 py-2 mt-2 mr-2
            rounded-lg
            border
            border-gray-300
            dark:border-gray-700
            bg-gray-200/95
            dark:bg-gray-800
            text-gray-900
            dark:text-white
            text-sm
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-card-border">
            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              NF
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              Cliente
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              UF Destino
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              Cidade
            </th>

            <th className="text-left p-2 text-center text-gray-700 dark:text-text-secondary">
              Status
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              Atraso (dias)
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              Frete
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              Mercadoria
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              Emissão
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              Previsão
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              Ocorrência
            </th>

            <th className="text-left p-2 text-gray-700 dark:text-text-secondary">
              Link
            </th>
          </tr>
        </thead>

        <tbody>
          {dadosPaginados.map((item, i) => {
            const dataPrev = parseDateBR(item.previsaoEntrega);
            const dataReal = parseDateBR(item.dataOcorrencia);

            const atrasado = dataPrev && dataReal ? dataReal > dataPrev : false;

            const diasAtraso =
              atrasado && dataPrev && dataReal
                ? Math.ceil(
                    (dataReal.getTime() - dataPrev.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0;

            return (
              <tr
                key={i}
                className="
                  border-b border-gray-100
                  dark:border-card-border
                  hover:bg-gray-300
                  dark:hover:bg-gray-500
                  transition-colors
                "
              >
                <td className="p-2 text-gray-800 dark:text-text-primary">
                  {item.notaFiscal}
                </td>

                <td className="p-2 text-gray-800 dark:text-text-primary">
                  {item.destinatario}
                </td>

                <td className="p-2 text-gray-800 text-center dark:text-text-primary">
                  {item.ufDestino}
                </td>

                <td className="p-2 text-gray-800 dark:text-text-primary">
                  {item.cidadeDestino}
                </td>

                {/* STATUS */}
                <td className="p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      atrasado
                        ? "bg-red-300 dark:bg-red-900 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-300"
                        : item.status === "FINALIZADO"
                        ? "bg-status-success/20 text-status-success border border-status-success/30"
                        : "bg-status-pending/20 text-status-pending border border-status-pending/30"
                    }`}
                  >
                    {atrasado ? "ATRASADO" : item.status}
                  </span>
                </td>

                {/* ATRASO */}
                <td className="p-2 w-5 text-center text-xs text-gray-800 dark:text-text-primary">
                  {atrasado ? `${diasAtraso} dias` : "-"}
                </td>

                <td className="p-2 text-gray-800 dark:text-text-primary">
                  R$ {item.valorFrete}
                </td>

                <td className="p-2 text-gray-800 dark:text-text-primary">
                  R$ {item.valorMercadoria}
                </td>

                <td className="p-2 text-center text-gray-800 dark:text-text-primary">
                  {item.dataEmissao}
                </td>

                <td className="p-2 text-center text-gray-800 dark:text-text-primary">
                  {item.previsaoEntrega}
                </td>

                <td className="p-2 text-center text-gray-800 dark:text-text-primary">
                  {item.dataOcorrencia}
                </td>

                {/* LINK */}
                <td className="p-2">
                  <button
                    onClick={() => visualizarEncomenda(item)}
                    className="
                      group flex items-center rounded-md
                      px-2 py-2
                      text-blue-600
                      dark:text-gray-400
                      hover:bg-gray-600
                      hover:text-white
                      transition-all duration-300
                    "
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* INFO */}
      {dadosFiltrados.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-text-secondary mt-2">
          Mostrando {dadosPaginados.length} de {dadosFiltrados.length} registros
        </p>
      )}

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
            disabled={paginaAtual === 1}
            className="
              px-3 py-1 rounded text-white text-sm
              disabled:opacity-50
              bg-blue-600 hover:bg-blue-600
              dark:hover:bg-blue-800
            "
          >
            Anterior
          </button>

          <span className="text-sm text-gray-700 dark:text-text-secondary">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
            className="
              px-3 py-1 rounded text-sm text-white
              disabled:opacity-50
              bg-blue-600 hover:bg-blue-600
              dark:hover:bg-blue-800
            "
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
