"use client";

import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { Stock } from "@/types/stock";

export default function StockPage() {
  const [list, setList] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [eanSearch, setEanSearch] = useState("");

  const fetchStock = async (ean: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stock?ean=${ean}`);
      if (response.ok) {
        const data = await response.json();
        console.log("teste", data);
        setList(data);
      }
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chama a API sempre que o usuário digitar algo
  useEffect(() => {
    if (eanSearch) {
      fetchStock(eanSearch);
    } else {
      setList([]); // limpa a lista se não houver busca
    }
  }, [eanSearch]);

  return (
    <div className="min-h-screen bg-gray-200/40 dark:bg-gray-950/95 pt-[130px]">
      <Loading isOpen={loading} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <h1 className="text-white text-2xl font-bold mb-6">📦 Estoque</h1>

        {/* Campo de busca */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por EAN..."
            value={eanSearch}
            onChange={(e) => setEanSearch(e.target.value)}
            className="w-full p-3 border rounded-lg text-white"
          />
        </div>

        <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left text-white">Código</th>
              <th className="p-3 text-left text-white">EAN</th>
              <th className="p-3 text-left text-white">Descrição</th>
              <th className="p-3 text-left text-white">Armazém</th>
              <th className="p-3 text-left text-white">SALDO ATUAL</th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0
              ? list.map((item) => (
                  <tr key={item.EAN13} className="border-t">
                    <td className="p-3 text-white">{item.CODIGO_PRODUTO}</td>
                    <td className="p-3 text-white">{item.EAN13}</td>
                    <td className="p-3 text-white">{item.DESCRIÇÃO}</td>
                    <td className="p-3 text-white">{item.ARMAZÉM}</td>
                    <td className="p-3 text-white">{item.SALDO_ATUAL}</td>
                  </tr>
                ))
              : eanSearch &&
                !loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center text-gray-500 text-white"
                    >
                      Nenhum produto encontrado
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      <Footer branch="SP" text="Estoque" />
    </div>
  );
}
