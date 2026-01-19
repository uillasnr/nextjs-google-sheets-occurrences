import { sheets, SPREADSHEET_ID } from "./auth";
import type { Stock } from "@/types/stock";

export class SaldoSheetsService {
  static async getSaldo(): Promise<Stock[]> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `SALDO!A2:F`, // pega todas as colunas
    });

    const rows = res.data.values || [];
    console.log("rows saldo", rows);

    return rows.map((row) => ({
      FILIAL: row[0] || "",
      EAN13: row[1] || "",
      CODIGO_PRODUTO: row[2] || "",
      DESCRIÇÃO: row[3] || "",
      ARMAZÉM: row[4] || 0,
      SALDO_ATUAL: row[5] || 0,
    }));
  }
}
