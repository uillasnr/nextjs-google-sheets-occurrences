"use client";

import { Package } from "lucide-react";
import { useState, useEffect } from "react";
import type { Occurrence } from "@/types/occurrence";
import OccurrenceCard from "@/components/OccurrenceCard";
import Stats from "@/components/Stats";
import OccurrenceModal from "@/components/OccurrenceModal";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { Dashboard } from "./components/dashboard";
// ✅ CORRETO: Importar o componente Dashboard (não o MonthlyTrendChart)


export default function Home() {
  const [list, setList] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(
    null
  );
  const [sheet, setSheet] = useState<"SP" | "PE" | "ES">("SP");
  const [statusFilter, setStatusFilter] = useState<
    "Todos" | "Pendente" | "Em Andamento" | "Resolvido"
  >("Todos");
  const [showDashboard, setShowDashboard] = useState(false);

  const filteredList = list.filter((item) => {
    if (statusFilter === "Todos") return true;
    return item.status === statusFilter;
  });

  const fetchOccurrences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/occurrences?sheet=${sheet}`);
      if (response.ok) {
        const data = await response.json();
        setList(data);
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

  const handleSubmit = async (occurrence: Occurrence) => {
    try {
      setLoading(true);
      const method = editingOccurrence?.id ? "PUT" : "POST";
      const url = editingOccurrence?.id
        ? `/api/occurrences/${occurrence.id}?sheet=${sheet}`
        : `/api/occurrences?sheet=${sheet}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(occurrence),
      });

      if (response.ok) {
        await fetchOccurrences();
        setIsModalOpen(false);
        setEditingOccurrence(null);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/occurrences/${id}?sheet=${sheet}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchOccurrences();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (occurrence: Occurrence) => {
    setEditingOccurrence(occurrence);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingOccurrence(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors pt-[130px]">
      <Loading isOpen={loading} />

      <Header
        sheet={sheet}
        setSheet={setSheet}
        onNew={handleNew}
        onToggleDashboard={() => setShowDashboard((prev) => !prev)}
      />

      {showDashboard ? (
        // 👉 DASHBOARD
        <div className="px-4 mt-15 sm:px-6">
          <Dashboard selectedBranch={sheet} occurrences={list} />
        </div>
      ) : (
        // 👉 LISTA NORMAL
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
            <Stats
              list={list}
              activeFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.length > 0
                ? filteredList.map((item) => (
                    <OccurrenceCard
                      key={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                : !loading && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border p-12 text-center col-span-full transition-colors">
                      <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Nenhuma ocorrência encontrada
                      </h3>
                    </div>
                  )}
            </div>
          </div>
        </>
      )}

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