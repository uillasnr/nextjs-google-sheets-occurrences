function parseDateBR(dateStr?: string) {
  if (!dateStr) return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return new Date(dateStr);

  const [day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`);
}
