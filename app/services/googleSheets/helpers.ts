// ================= STATUS =================
export type StatusCanonico =
  | "RESOLVIDO"
  | "EM_ANDAMENTO"
  | "PENDENTE"
  | "CANCELADO";

const STATUS_MAP: Record<string, StatusCanonico> = {
  OK: "RESOLVIDO",
  RESOLVIDO: "RESOLVIDO",
  FINALIZADO: "RESOLVIDO",
  "EM ANDAMENTO": "EM_ANDAMENTO",
  "EM ABERTO": "PENDENTE",
  "AGUARDANDO PAGAMENTO": "PENDENTE",
  "FALTA DE PROVAS": "PENDENTE",
  CANCELADO: "CANCELADO",
  PENDENTE: "PENDENTE",
};
// =====================================================
// 🔹 REGRA DO EXCEL (COLUNA T)
// Só grava "OK" quando Cliente e Transportadora forem
// RESOLVIDO ou FALTA DE PROVAS
// Caso contrário → string vazia
// =====================================================
export function statusExcel(
  statusCliente: string,
  statusTransportadora: string
): string {
  const cliente = (statusCliente || "").toUpperCase();
  const transportadora = (statusTransportadora || "").toUpperCase();

  const valoresValidos = ["RESOLVIDO", "FALTA DE PROVAS"];

  const clienteOk = valoresValidos.includes(cliente);
  const transportadoraOk = valoresValidos.includes(transportadora);

  if (clienteOk && transportadoraOk) {
    return "OK";
  }

  return "";
}

export function normalizarStatus(
  statusFinal: string,
  statusGeral: string,
  statusCliente: string,
  statusTransportadora: string
): string {
  const final = (statusFinal || "").toUpperCase();
  const geral = (statusGeral || "").toUpperCase();
  const cliente = (statusCliente || "").toUpperCase();
  const transportadora = (statusTransportadora || "").toUpperCase();

  if (final === "OK") return "Resolvido";
  if (geral.includes("CANCEL")) return "Cancelado";
  if (cliente !== transportadora) return "Em Andamento";
  if (geral.includes("EM ANDAMENTO")) return "Em Andamento";

  if (
    cliente.includes("RESOLVIDO") &&
    transportadora.includes("RESOLVIDO")
  ) {
    return "Resolvido";
  }

  return "Pendente";
}

// ================= DATA =================
export function excelDateToISO(value: any): string {
  if (!value) return "";
  if (typeof value === "number") {
    const date = new Date((value - 25569) * 86400 * 1000);
    return date.toISOString().split("T")[0];
  }
  return value;
}

// ================= VALIDAÇÃO =================
export function isValidId(id: any): boolean {
  if (!id) return false;
  return String(id).trim().toUpperCase() !== "ID";
}
