import { Expedicao } from "@/types/Expedicao";

export function agruparPorCliente(lista: Expedicao[]) {
  const grupos: Record<string, Expedicao[]> = {};

  lista.forEach((nf) => {
    if (nf.status !== "NF DISPONIVEIS" && nf.status !== "AGUARDANDO") return;

    if (!grupos[nf.cliente]) {
      grupos[nf.cliente] = [];
    }

    grupos[nf.cliente].push(nf);
  });

  // Retorna só clientes com mais de 1 NF
  return Object.entries(grupos)
    .filter(([_, nfs]) => nfs.length > 1)
    .map(([cliente, nfs]) => ({ cliente, nfs }));
}
