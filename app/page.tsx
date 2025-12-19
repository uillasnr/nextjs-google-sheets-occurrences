"use client";

import { Package, Truck, Plus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import type { Occurrence } from "@/types/occurrence";
import OccurrenceCard from "@/components/OccurrenceCard";
import Stats from "@/components/Stats";
import OccurrenceModal from "@/components/OccurrenceModal";

export default function Home() {
  const [list, setList] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);
  const [sheet, setSheet] = useState<"SP" | "PE" | "ES">("SP");
  const [statusFilter, setStatusFilter] = useState<
    "Todos" | "Pendente" | "Em Andamento" | "Resolvido"
  >("Todos");

  const filteredList = list.filter((item) => {
    if (statusFilter === "Todos") return true;
    return item.status === statusFilter;
  });

  // Carregar ocorrências do Google Sheets
  const fetchOccurrences = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/occurrences?sheet=${sheet}`);

      if (response.ok) {
        const data = await response.json();
        setList(data);
        console.log("Response status:", data);
      }
    } catch (error) {
      console.error("Erro ao carregar ocorrências:", error);
      alert("Erro ao carregar ocorrências do Google Sheets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOccurrences();
  }, [sheet]);

  // Criar ou atualizar ocorrência
  const handleSubmit = async (occurrence: Occurrence) => {
    try {
      if (editingOccurrence?.id) {
        // Atualizar
        const response = await fetch(`/api/occurrences?sheet=${sheet}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(occurrence),
        });

        if (response.ok) {
          await fetchOccurrences();
          setIsModalOpen(false);
          setEditingOccurrence(null);
          alert("Ocorrência atualizada com sucesso!");
        }
      } else {
        // Criar
        const response = await fetch(`/api/occurrences?sheet=${sheet}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(occurrence),
        });

        if (response.ok) {
          await fetchOccurrences();
          setIsModalOpen(false);
          alert("Ocorrência criada com sucesso!");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar ocorrência:", error);
      alert("Erro ao salvar ocorrência no Google Sheets");
    }
  };

  // Deletar ocorrência
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta ocorrência?")) return;

    try {
      const response = await fetch(`/api/occurrences/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchOccurrences();
        alert("Ocorrência deletada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao deletar ocorrência:", error);
      alert("Erro ao deletar ocorrência do Google Sheets");
    }
  };

  // Abrir modal para edição
  const handleEdit = (occurrence: Occurrence) => {
    setEditingOccurrence(occurrence);
    setIsModalOpen(true);
  };

  // Abrir modal para nova ocorrência
  const handleNew = () => {
    setEditingOccurrence(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">
            Carregando ocorrências...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER */}
      <div className="bg-white shadow-lg border-b border-slate-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-2xl shadow-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  Ocorrências de Transporte
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                 Sistema de Gestão de Ocorrências.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex gap-2">
                {["SP", "PE", "ES"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSheet(s as any)}
                    className={`px-4 py-2 rounded-lg ${
                      sheet === s ? "bg-blue-600 text-white" : "bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchOccurrences}
                disabled={refreshing}
                className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Atualizar
              </button>
              <button
                onClick={handleNew}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nova Ocorrência
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <Stats
          list={list}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      {/* LISTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.length > 0 ? (
            filteredList.map((item) => (
              <OccurrenceCard
                key={item.nota}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center col-span-full">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Nenhuma ocorrência encontrada
              </h3>
              <p className="text-slate-500 mb-4">
                Clique no botão acima para registrar uma nova ocorrência.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <OccurrenceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOccurrence(null);
        }}
        onSubmit={handleSubmit}
        editingOccurrence={editingOccurrence}
        sheet={sheet}
      />
    </div>
  );
}
