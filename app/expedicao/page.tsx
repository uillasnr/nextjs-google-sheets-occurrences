"use client";

import { useState, useEffect } from "react";
import { Search, Package, User, CreditCard, Car, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Occurrence } from "@/types/occurrence";
import Loading from "@/components/Loading";
import Header from "@/app/components/Header";
import Footer from "@/components/Footer";

export default function ExpedicaoPage() {
  const [sheet, setSheet] = useState<"SP" | "PE" | "ES">("SP");
  const [searchTerm, setSearchTerm] = useState("");
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [filteredOccurrences, setFilteredOccurrences] = useState<Occurrence[]>([]);
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    recebedorNome: "",
    recebedorCpf: "",
    recebedorPlaca: "",
  });

  const fetchOccurrences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/occurrences?sheet=${sheet}`);
      if (response.ok) {
        const data = await response.json();
        setOccurrences(data);
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccurrences();
  }, [sheet]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredOccurrences([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = occurrences.filter(
      (occ) =>
        occ.nota?.toString().toLowerCase().includes(term) ||
        occ.cliente?.toLowerCase().includes(term)
    );
    setFilteredOccurrences(filtered);
  };

  const handleSelect = (occ: Occurrence) => {
    setSelectedOccurrence(occ);
    setFilteredOccurrences([]);
    setSearchTerm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOccurrence) return;

    try {
      setLoading(true);
      const updatedOccurrence = {
        ...selectedOccurrence,
        ...formData,
        status: "Resolvido",
        dataRetirada: new Date().toISOString(),
      };

      const response = await fetch(`/api/occurrences/${selectedOccurrence.id}?sheet=${sheet}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOccurrence),
      });

      if (response.ok) {
        setSuccess(true);
        setSelectedOccurrence(null);
        setFormData({ recebedorNome: "", recebedorCpf: "", recebedorPlaca: "" });
        fetchOccurrences();
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar expedição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200/40 dark:bg-gray-950/95 transition-colors pt-[130px]">
      <Loading isOpen={loading} />
      
      <Header
        sheet={sheet}
        setSheet={setSheet}
        onNew={() => {}}
        onSearchNF={() => false}
        onClearSearch={() => {}}
        goToHome={() => {}}
        goToDashboard={() => {}}
        occurrences={occurrences}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Voltar para Início
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expedição de Mercadorias</h1>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-6 h-6" />
            <p className="font-medium">Retirada concluída com sucesso!</p>
          </div>
        )}

        {!selectedOccurrence ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar por Nota Fiscal ou Nome do Cliente
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Digite a NF ou nome do cliente..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md"
              >
                Buscar
              </button>
            </div>

            {filteredOccurrences.length > 0 && (
              <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOccurrences.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => handleSelect(occ)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                  >
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">NF: {occ.nota}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{occ.cliente}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">{occ.volumes} volumes</p>
                      <p className="text-xs text-gray-400">{occ.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Detalhes da Nota */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Detalhes da Carga
                  </h2>
                  <p className="text-sm text-gray-500">Verifique os volumes antes de entregar</p>
                </div>
                <button
                  onClick={() => setSelectedOccurrence(null)}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Cancelar
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Nota Fiscal</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{selectedOccurrence.nota}</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold mb-1">Volumes</p>
                  <p className="text-xl font-black text-blue-700 dark:text-blue-300">{selectedOccurrence.volumes}</p>
                </div>
                <div className="col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Cliente</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedOccurrence.cliente}</p>
                </div>
              </div>
            </div>

            {/* Formulário de Retirada */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                Dados do Recebedor
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="text"
                      value={formData.recebedorNome}
                      onChange={(e) => setFormData({ ...formData, recebedorNome: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Quem está retirando?"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CPF
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        required
                        type="text"
                        value={formData.recebedorCpf}
                        onChange={(e) => setFormData({ ...formData, recebedorCpf: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Placa do Veículo
                    </label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        required
                        type="text"
                        value={formData.recebedorPlaca}
                        onChange={(e) => setFormData({ ...formData, recebedorPlaca: e.target.value.toUpperCase() })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="ABC-1234"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6"
              >
                <CheckCircle2 className="w-6 h-6" />
                Confirmar Retirada e Finalizar
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Footer branch={sheet} text="Módulo de Expedição" />
      </div>
    </div>
  );
}
