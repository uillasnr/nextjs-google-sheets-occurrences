import { Expedicao } from "@/types/Expedicao";

export function agruparPorCliente(lista: Expedicao[]) {
  const mapa: Record<string, Expedicao[]> = {};

  lista.forEach((nf) => {
    const key = nf.cliente?.trim() || "Sem cliente";
    if (!mapa[key]) mapa[key] = [];
    mapa[key].push(nf);
  });

  return Object.entries(mapa)
    .map(([cliente, nfs]) => ({ cliente, nfs }))
    .sort((a, b) => a.cliente.localeCompare(b.cliente));
}
