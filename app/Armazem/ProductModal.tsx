"use client";

import {
  FileText,
  Hash,
  Truck,
  Package,
  Calendar,
  MessageSquare,
  CheckCircle2,
  X,
} from "lucide-react";

import Input from "./Input";

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  handleChange,
  onStatusChange,
  linhas,
  onLinhaChange,
  onAdicionarLinha,
  onRemoverLinha,
}: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-4xl mx-4 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Novo Produto
            </h2>
            <p className="text-sm text-gray-500">
              Preencha a nota e adicione quantos produtos quiser com os mesmos dados da nota
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={onSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Nota Fiscal"
              name="nota"
              icon={<FileText />}
              value={formData.nota}
              onChange={handleChange}
            />
            <Input
              label="Responsável"
              name="Responsavel"
              icon={<Hash />}
              value={formData.Responsavel}
              onChange={handleChange}
            />
            <Input
              label="Transportadora"
              name="transportadora"
              icon={<Truck />}
              value={formData.transportadora}
              onChange={handleChange}
            />

          
            <Input
              label="Tipo Ocorrência"
              name="tipoOcorrencia"
              icon={<MessageSquare />}
              value={formData.tipoOcorrencia}
              onChange={handleChange}
            />
            <Input
              label="Entrada 48"
              name="dataEntrada48"
              type="date"
              icon={<Calendar />}
              value={formData.dataEntrada48}
              onChange={handleChange}
            />
            <Input
              label="Saída 48"
              name="dataSaida48"
              type="date"
              icon={<Calendar />}
              value={formData.dataSaida48}
              onChange={handleChange}
            />

         
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-700/50 dark:bg-gray-700/50">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Status da nota
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["Pendente", "Finalizado"] as const).map((statusOption) => {
                const isActive = formData.status === statusOption;
                return (
                  <button
                    key={statusOption}
                    type="button"
                    onClick={() => onStatusChange(statusOption)}
                    className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-blue-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {statusOption}
                  </button>
                );
              })}
            </div>
          </div>

          <Input
              label="Observação"
              name="obs"
              icon={<MessageSquare />}
              value={formData.obs}
              onChange={handleChange}
            />

          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Produtos da nota
                </h3>
                <p className="text-xs text-gray-500">
                  Adicione quantas linhas de SKU/descrição/quantidade quiser.
                </p>
              </div>

              <button
                type="button"
                onClick={onAdicionarLinha}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium"
              >
                + Adicionar produto
              </button>
            </div>

            <div className="space-y-3">
              {linhas.map((linha: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr_0.8fr_auto] gap-3 items-end"
                >
                  <Input
                    label={`SKU ${index + 1}`}
                    name={`sku-${index}`}
                    icon={<Hash />}
                    value={linha.sku}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onLinhaChange(index, "sku", e.target.value)
                    }
                  />

                  <Input
                    label="Descrição"
                    name={`descricao-${index}`}
                    icon={<Package />}
                    value={linha.descricao}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onLinhaChange(index, "descricao", e.target.value)
                    }
                  />

                  <Input
                    label="Quantidade"
                    name={`quantidade-${index}`}
                    type="number"
                    icon={<Package />}
                    value={linha.quantidade}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onLinhaChange(index, "quantidade", e.target.value)
                    }
                  />

                  {linhas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoverLinha(index)}
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
              >
              Cancelar
            </button>

            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
