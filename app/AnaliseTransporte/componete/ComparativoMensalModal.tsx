"use client";

import type { Transporte } from "@/types/transporte";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Transporte[];
};

export default function ComparativoMensalModal({
  isOpen,
  onClose,
  data,
}: Props) {
  if (!isOpen) return null;

  const dados = calcularComparativo(data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/40 dark:bg-gray-950">
      <div className="w-[95%] max-w-6xl bg-gray-200 dark:bg-gray-950/95 border border-card-border rounded-card shadow-card p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-black">
            Comparativo Mensal
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        {/* TABELA */}
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-border-default">
                <th className="p-3 text-left">Mês</th>
                <th className="p-3">Total</th>
                <th className="p-3">Aberto</th>
                <th className="p-3">Finalizado</th>
                <th className="p-3">Antes</th>
                <th className="p-3">Após</th>
                <th className="p-3">Exato</th>
                <th className="p-3">Dentro</th>
              </tr>
            </thead>

            <tbody>
              {dados.map((item: any, i: number) => (
                <tr key={i} className="border-b border-border-default">
                  <td className="p-3">{item.mes}</td>
                  <td className="p-3 text-center">{item.total}</td>
                  <td className="p-3 text-center text-status.pending">
                    {item.aberto}
                  </td>
                  <td className="p-3 text-center text-status.success">
                    {item.finalizado}
                  </td>
                  <td className="p-3 text-center text-status.success">
                    {item.antes}
                  </td>
                  <td className="p-3 text-center text-status.error">
                    {item.apos}
                  </td>
                  <td className="p-3 text-center text-status.warning">
                    {item.exato}
                  </td>
                  <td className="p-3 text-center text-brand-primary font-bold">
                    {item.dentro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function calcularComparativo(data: Transporte[]) {
  const mesesMap: any = {};

  data.forEach((item) => {
    const mes = item.mes || "N/A";

    if (!mesesMap[mes]) {
      mesesMap[mes] = {
        mes,
        total: 0,
        aberto: 0,
        finalizado: 0,
        antes: 0,
        apos: 0,
        exato: 0,
      };
    }

    const m = mesesMap[mes];

    m.total++;

    if (item.status === "FINALIZADO") {
      m.finalizado++;

      // 🔥 REGRA DE PRAZO (ajuste conforme sua lógica real)
      const dataEntrega = new Date(item.dataOcorrencia);
      const previsao = new Date(item.previsaoEntrega);

      if (dataEntrega < previsao) m.antes++;
      else if (dataEntrega > previsao) m.apos++;
      else m.exato++;
    } else {
      m.aberto++;
    }
  });

  // montar array + calcular %
  return Object.values(mesesMap).map((m: any) => {
    const dentro = m.antes + m.exato;

    return {
      mes: m.mes,
      total: m.total,
      aberto: m.aberto,
      finalizado: m.finalizado,
      antes: `${m.antes} (${percent(m.antes, m.finalizado)}%)`,
      apos: `${m.apos} (${percent(m.apos, m.finalizado)}%)`,
      exato: `${m.exato} (${percent(m.exato, m.finalizado)}%)`,
      dentro: `${dentro} (${percent(dentro, m.finalizado)}%)`,
    };
  });
}

function percent(valor: number, total: number) {
  if (!total) return 0;
  return Math.round((valor / total) * 100);
}
