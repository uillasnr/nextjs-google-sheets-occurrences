export function formatDateBR(date?: string) {
  if (!date) return '-'

  // Garante que só formata YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date

  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
