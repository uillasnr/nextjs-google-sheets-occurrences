import { Occurrence, TIPO_OCORRENCIA_MAP } from "@/types/occurrence";

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

export function getAvailableYears(
  occurrences: { dataNota?: string }[]
): number[] {
  const years = new Set<number>()

  occurrences.forEach(item => {
    if (!item.dataNota) return

    const year = extractYearFromDate(item.dataNota)
    if (year) years.add(year)
  })

  return Array.from(years).sort((a, b) => b - a)
}


function extractYearFromDate(date: string): number | null {
  // ISO → YYYY-MM-DD
  if (date.includes("-")) {
    const parts = date.split("-")
    if (parts.length !== 3) return null
    return Number(parts[0]) // ano
  }

  // BR → DD/MM/YYYY
  if (date.includes("/")) {
    const parts = date.split("/")
    if (parts.length !== 3) return null
    return Number(parts[2]) // ano
  }

  return null
}


function extractMonthFromDate(date: string): number | null {
  // ISO → YYYY-MM-DD
  if (date.includes("-")) {
    const parts = date.split("-")
    if (parts.length !== 3) return null
    return Number(parts[1]) // mês
  }

  // BR → DD/MM/YYYY
  if (date.includes("/")) {
    const parts = date.split("/")
    if (parts.length !== 3) return null
    return Number(parts[1]) // mês
  }

  return null
}



export function groupOccurrencesByMonth(
  occurrences: { dataNota?: string; nota?: string }[],
  year?: number
) {
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ]

  const result = months.map(month => ({
    month,
    total: 0,
    notas: [] as string[], // ✅ lista de notas do mês
  }))

  occurrences.forEach(item => {
    if (!item.dataNota) return

    const month = extractMonthFromDate(item.dataNota)
    const itemYear = extractYearFromDate(item.dataNota)

    if (!month || !itemYear) return
    if (year && itemYear !== year) return

    const index = month - 1

    result[index].total += 1

    // ✅ adiciona a nota
    if (item.nota) {
      result[index].notas.push(item.nota)
    }
  })

  return result
}

export function groupOccurrencesByType(occurrences: Occurrence[],
  year?: number) {

   const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ]

  const result = months.map(month => ({ month }))

  occurrences.forEach(o => {
    if (!o.dataNota || !o.tipo) return

    const monthIndex = extractMonthFromDate(o.dataNota)
    const itemYear = extractYearFromDate(o.dataNota)

    if (!monthIndex || !itemYear) return
    if (year && itemYear !== year) return

    // 🔹 AQUI está o ponto-chave
    const tipoLegivel =
      TIPO_OCORRENCIA_MAP[o.tipo] || o.tipo

    const row = result[monthIndex - 1]

    ;(row as any)[tipoLegivel] =
      ((row as any)[tipoLegivel] || 0) + 1
  })

  return result
}


export function groupOccurrencesByTransportadora(
  occurrences: Occurrence[],
  year?: number
) {
 
   const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ]

  const result = months.map(month => ({
    month,
    transportadoras: {} as Record<string, Record<string, number>>
  }))

  occurrences.forEach(o => {
    if (!o.dataNota || !o.tipo || !o.transportadora) return

    const monthIndex = extractMonthFromDate(o.dataNota)
    const itemYear = extractYearFromDate(o.dataNota)

    if (!monthIndex || !itemYear) return
    if (year && itemYear !== year) return

    const tipoLegivel =
      TIPO_OCORRENCIA_MAP[o.tipo] || o.tipo

    const row = result[monthIndex - 1]

    // 🔹 cria transportadora se não existir
    if (!row.transportadoras[o.transportadora]) {
      row.transportadoras[o.transportadora] = {}
    }

    // 🔹 soma por tipo
    row.transportadoras[o.transportadora][tipoLegivel] =
      (row.transportadoras[o.transportadora][tipoLegivel] || 0) + 1
  })

  return result
}

export function groupOccurrencesByState(
  occurrences: Occurrence[],
  year?: number
) {
  const totals: Record<string, number> = {}

  occurrences.forEach((o) => {
    if (!o.dataNota) return

    const itemYear = extractYearFromDate(o.dataNota)
    if (!itemYear) return

    if (year && itemYear !== year) return

    const estado = o.estado?.trim() || "Desconhecido"
    if (!estado) return

    totals[estado] = (totals[estado] || 0) + 1
  })

  return Object.entries(totals)
    .map(([estado, count]) => ({ estado, count }))
    .sort((a, b) => b.count - a.count)
}