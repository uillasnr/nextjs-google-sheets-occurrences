"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Occurrence } from "@/types/occurrence";

import { Dashboard } from "./components/dashboard";
import Header from "@/app/components/Header";
import Loading from "@/components/Loading";
import OccurrenceModal from "@/app/components/OccurrenceModal";
import SearchResultModal from "@/app/components/SearchResultModal";

export default function DashboardPage() {
  const router = useRouter();
  const [list, setList] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(
    null
  );
  const [sheet, setSheet] = useState<
    "SP" | "PE" | "ES" | "Fábrica" | "Tocantins_SP"
  >("SP");
  const [statusFilter, setStatusFilter] = useState<
    "Todos" | "Pendente" | "Em Andamento" | "Resolvido"
  >("Pendente");
  const [searchedOccurrence, setSearchedOccurrence] =
    useState<Occurrence | null>(null);
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false);

  const handleSearchByNF = (nf: string): boolean => {
    const found = list.find((item) => item.nota?.toString() === nf);

    if (found) {
      setSearchedOccurrence(found);
      setIsSearchResultOpen(true);
      return true;
    }

    return false;
  };

  const closeSearchResult = () => {
    setIsSearchResultOpen(false);
    setSearchedOccurrence(null);
  };

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
    <div className="min-h-screen bg-gray-200/40 dark:bg-gray-950/95 transition-colors pt-[130px]">
      <Loading isOpen={loading} />

      <Header
        sheet={sheet}
        setSheet={setSheet}
        onNew={handleNew}
        onSearchNF={handleSearchByNF}
        onClearSearch={closeSearchResult}
        goToHome={() => router.push("/")}
        goToDashboard={() => router.push("/dashboard")}
        occurrences={list}
      />

      <div className="px-4 mt-15 sm:px-6">
        <Dashboard selectedBranch={sheet} occurrences={list} />
      </div>

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

      <SearchResultModal
        isOpen={isSearchResultOpen}
        occurrence={searchedOccurrence}
        onClose={closeSearchResult}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
