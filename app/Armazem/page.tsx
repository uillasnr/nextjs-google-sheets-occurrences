"use client";

import { useState } from "react";

import Footer from "@/components/Footer";
import HeaderCadastro from "./HeaderCadastro";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

type Produto = {
  id: string;
  filial: string;
  nota: string;
  ocorrencia: string;
  transportadora: string;
  sku: string;
  descricao: string;
  quantidade: string;
  tipoOcorrencia: string;
  dataEntrada48: string;
  dataSaida48: string;
  tracking: string;
  obs: string;
};

export default function Armazem() {
  const [sheet, setSheet] = useState<
    "SP" | "PE" | "ES" | "Fábrica" | "Tocantins_SP"
  >("SP");

  const [products, setProducts] = useState<Produto[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const initialForm = {
    nota: "",
    ocorrencia: "",
    transportadora: "",
    sku: "",
    descricao: "",
    quantidade: "",
    tipoOcorrencia: "",
    dataEntrada48: "",
    dataSaida48: "",
    tracking: "",
    obs: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Produto = {
      id: Date.now().toString(),
      filial: sheet,
      ...formData,
    };

    setProducts((prev) => [newProduct, ...prev]);

    setFormData(initialForm);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className=" bg-gray-200/40 dark:bg-gray-950/95 pt-[100px]">
      <HeaderCadastro
        sheet={sheet}
        setSheet={setSheet}
        onNew={() => setIsAdding(true)}
      />

      <main className="min-h-screen max-w-6xl mx-auto  px-4 sm:px-6 mt-10">
        {/* LISTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((item) => (
              <ProductCard key={item.id} data={item} onDelete={handleDelete} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-20">
              Nenhum produto cadastrado
            </div>
          )}
        </div>
      </main>

      <Footer branch={sheet} text="Armazém 48" />

      {/* ✅ MODAL FORA DO LAYOUT */}
      <ProductModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
}
