export function formatDateBR(date?: string) {
  if (!date) return "-";

  // Se já estiver em DD/MM/YYYY, retorna direto
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }

  // Se vier YYYY-MM-DD, converte
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  return date;
}
