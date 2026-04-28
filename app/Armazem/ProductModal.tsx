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
      <div className="relative w-full max-w-4xl mx-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 animate-fadeIn">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Novo Produto
            </h2>
            <p className="text-sm text-gray-500">
              Preencha as informações do produto
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
              label="Ocorrência"
              name="ocorrencia"
              icon={<Hash />}
              value={formData.ocorrencia}
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
              label="SKU"
              name="sku"
              icon={<Hash />}
              value={formData.sku}
              onChange={handleChange}
            />
            <Input
              label="Descrição"
              name="descricao"
              icon={<Package />}
              value={formData.descricao}
              onChange={handleChange}
            />
            <Input
              label="Quantidade"
              name="quantidade"
              type="number"
              icon={<Package />}
              value={formData.quantidade}
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

            <Input
              label="Tracking"
              name="tracking"
              icon={<Truck />}
              value={formData.tracking}
              onChange={handleChange}
            />
            <Input
              label="Observação"
              name="obs"
              icon={<MessageSquare />}
              value={formData.obs}
              onChange={handleChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
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
