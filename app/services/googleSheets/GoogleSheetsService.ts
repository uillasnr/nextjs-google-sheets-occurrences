import { randomUUID } from "crypto";
import type { Occurrence } from "@/types/occurrence";
import { sheets, SPREADSHEET_ID } from "./auth";
import { COLUMN_MAP } from "./columnMap";
import { excelDateToISO, isValidId, normalizarStatus } from "./helpers";

export class GoogleSheetsService {
  // ================= GET =================
  static async getOccurrences(sheetName: string): Promise<Occurrence[]> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:T`,
    });

    const rows = res.data.values || [];

    return rows
      .filter((row) => isValidId(row[0]))
      .map((row) => ({
        id: row[0],
        nota: row[1],
        volumes: row[2] || "",
        tipo: row[3] || "",
        solicitante: row[4] || "",
        dataNota: excelDateToISO(row[5]),
        dataOcorrencia: excelDateToISO(row[6]),
        transportadora: row[7] || "",
        cliente: row[8] || "",
        destino: row[9] || "",
        estado: row[10] || "",
        pedido: row[11] || "",
        ocorrencia: row[12] || "",
        ultimaOcorrencia: excelDateToISO(row[13]),
        statusCliente: row[14] || "",
        statusTransportadora: row[15] || "",
        tracking: row[16] || "",
        obs: row[17] || "",
        pendencia: row[18] || "",
        status: normalizarStatus(row[19], row[19], row[14], row[15]),
        recebedorNome: row[20] || "",
        recebedorCpf: row[21] || "",
        recebedorPlaca: row[22] || "",
        dataRetirada: row[23] || "",
      }));
  }

  // ================= CREATE =================
  static async createOccurrence(sheet: string, data: Occurrence) {
    const id = randomUUID();

    const row = COLUMN_MAP.map((col) => (col === "id" ? id : data[col] ?? ""));

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheet}'!A:Z`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS", // ✅ ESSENCIAL
      requestBody: { values: [row] },
    });

    return { ...data, id };
  }

  // ================= UPDATE =================
  static async updateOccurrence(sheet: string, id: string, data: Occurrence) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheet}'!A:A`,
    });

    const rows = res.data.values || [];
    const index = rows.findIndex((r) => r[0] === id);

    if (index === -1) throw new Error("ID não encontrado");

    const rowNumber = index + 1;

    const updatedRow = COLUMN_MAP.map((col) =>
      col === "id" ? id : data[col] ?? ""
    );

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheet}'!A${rowNumber}:X${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: { values: [updatedRow] },
    });
  }

  // ================= DELETE =================
  static async deleteOccurrence(id: string, sheetName: string) {
    // 1️⃣ Buscar os valores da planilha
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values || [];

    // 2️⃣ Descobrir o índice da linha pelo ID
    let rowIndex = -1;

    for (let i = 1; i < rows.length; i++) {
      // pula o header
      if (rows[i][0] === id) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error("ID não encontrado");
    }

    // 3️⃣ Buscar o sheetId numérico
    const sheetMeta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = sheetMeta.data.sheets?.find(
      (s) => s.properties?.title === sheetName
    );

    if (!sheet || sheet.properties?.sheetId == null) {
      throw new Error("Aba não encontrada");
    }

    const sheetId = sheet.properties.sheetId;

    // 4️⃣ Deletar a linha
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });
  }
}
