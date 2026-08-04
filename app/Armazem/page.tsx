"use client";

import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import HeaderCadastro from "./HeaderCadastro";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

type StatusNota = "Pendente" | "Finalizado";

type ProdutoLinha = {
  sku: string;
  descricao: string;
  quantidade: string;
};

type NotaAgrupada = {
  id: string;
  filial: string;
  nota: string;
  Responsavel: string;
  transportadora: string;
  tipoOcorrencia: string;
  dataEntrada48: string;
  dataSaida48: string;
  tracking: string;
  obs: string;
  status: StatusNota;
  itens: ProdutoLinha[];
  ocorrencia?: string;
};

export default function Armazem() {
  const [sheet, setSheet] = useState<
    "SP" | "PE" | "ES" | "Fábrica" | "Tocantins_SP"
  >("SP");

  const [notas, setNotas] = useState<NotaAgrupada[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [produtosLinhas, setProdutosLinhas] = useState<ProdutoLinha[]>([
    { sku: "", descricao: "", quantidade: "" },
  ]);

  const initialForm = {
    nota: "",
    Responsavel: "",
    transportadora: "",
    sku: "",
    descricao: "",
    quantidade: "",
    tipoOcorrencia: "",
    status: "Pendente" as StatusNota,
    dataEntrada48: "",
    dataSaida48: "",
    tracking: "",
    obs: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchNotas = async (currentSheet = sheet) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch(`/api/armazem?sheet=${currentSheet}`);

      if (!response.ok) {
        throw new Error("Erro ao carregar notas");
      }

      const data = await response.json();
      setNotas(data);
    } catch (error) {
      console.error("Erro ao carregar notas:", error);
      setErrorMessage("Não foi possível carregar as notas da aba ARMAZEM 48.");
      setNotas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas(sheet);
  }, [sheet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status: StatusNota) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleLinhaChange = (
    index: number,
    field: keyof ProdutoLinha,
    value: string
  ) => {
    setProdutosLinhas((prev) =>
      prev.map((linha, linhaIndex) =>
        linhaIndex === index ? { ...linha, [field]: value } : linha
      )
    );
  };

  const handleAdicionarLinha = () => {
    setProdutosLinhas((prev) => [...prev, { sku: "", descricao: "", quantidade: "" }]);
  };

  const handleRemoverLinha = (index: number) => {
    setProdutosLinhas((prev) =>
      prev.length > 1 ? prev.filter((_, linhaIndex) => linhaIndex !== index) : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const linhasValidas = produtosLinhas.filter(
      (linha) => linha.sku || linha.descricao || linha.quantidade
    );

    if (linhasValidas.length === 0) {
      setIsAdding(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/armazem?sheet=${sheet}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nota: formData.nota,
          Responsavel: formData.Responsavel,
          transportadora: formData.transportadora,
          tipoOcorrencia: formData.tipoOcorrencia,
          dataEntrada48: formData.dataEntrada48,
          dataSaida48: formData.dataSaida48,
          tracking: formData.tracking,
          obs: formData.obs,
          status: formData.status,
          itens: linhasValidas,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar nota");
      }

      const novaNota = await response.json();

      setNotas((prev) => {
        const notaExistenteIndex = prev.findIndex(
          (item) => item.nota.trim().toLowerCase() === novaNota.nota.trim().toLowerCase()
        );

        if (notaExistenteIndex >= 0) {
          const atualizados = [...prev];
          atualizados[notaExistenteIndex] = {
            ...atualizados[notaExistenteIndex],
            ...novaNota,
            itens: [...atualizados[notaExistenteIndex].itens, ...novaNota.itens],
          };
          return atualizados;
        }

        return [novaNota, ...prev];
      });

      setFormData(initialForm);
      setProdutosLinhas([{ sku: "", descricao: "", quantidade: "" }]);
      setIsAdding(false);
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      setErrorMessage("Não foi possível salvar a nota na aba ARMAZEM 48.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/armazem/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir nota");
      }

      setNotas((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao excluir nota:", error);
      setErrorMessage("Não foi possível excluir a nota da aba ARMAZEM 48.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-gray-200/40 dark:bg-gray-950/95 pt-[100px]">
      <HeaderCadastro
        sheet={sheet}
        setSheet={setSheet}
        onNew={() => setIsAdding(true)}
      />

      <main className="min-h-screen px-6 mt-10 mb-5">
        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && notas.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white/70 py-16 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900/70">
              Carregando notas da aba ARMAZEM 48...
            </div>
          ) : notas.length > 0 ? (
            notas.map((item) => (
              <ProductCard key={item.id} data={item} onDelete={handleDelete} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white/70 py-20 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900/70">
              Nenhuma nota cadastrada
            </div>
          )}
        </div>
      </main>

      <Footer branch={sheet} text="Armazém 48" />

      {/* ✅ MODAL FORA DO LAYOUT */}
      <ProductModal
        isOpen={isAdding}
        onClose={() => {
          setIsAdding(false);
          setProdutosLinhas([{ sku: "", descricao: "", quantidade: "" }]);
          setFormData(initialForm);
        }}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        onStatusChange={handleStatusChange}
        linhas={produtosLinhas}
        onLinhaChange={handleLinhaChange}
        onAdicionarLinha={handleAdicionarLinha}
        onRemoverLinha={handleRemoverLinha}
      />
    </div>
  );
}
