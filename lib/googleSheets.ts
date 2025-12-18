import { google } from "googleapis";
import type { Occurrence } from "@/types/occurrence";

// =================== AUTH ===================
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
if (!SPREADSHEET_ID) {
  throw new Error("GOOGLE_SHEET_ID não encontrado no .env");
}

// =================== HELPERS ===================
function normalizarStatus(status: string): string {
  if (!status) return "Pendente";
  const s = status.toUpperCase();
  if (s.includes("RESOLVIDO")) return "Resolvido";
  if (s.includes("ABERTO") || s.includes("ANDAMENTO")) return "Em Andamento";
  if (s.includes("CANCEL")) return "Cancelado";
  return "Pendente";
}

function excelDateToISO(value: any): string {
  if (!value) return "";
  if (typeof value === "number") {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    return date.toISOString().split("T")[0];
  }
  return value;
}
//FUNÇÃO PARA IGNORAR HEADER
function isHeaderRow(row: any[]): boolean {
  return (
    row[0]?.toString().toUpperCase().includes("NOTA") ||
    row[1]?.toString().toUpperCase().includes("VOLUME") ||
    row[3]?.toString().toUpperCase().includes("SOLICITANTE")
  );
}

function isValidRow(row: any[]): boolean {
  return (
    row[0]?.toString().trim() &&
    row[3]?.toString().trim() &&
    row[4]?.toString().trim()
  );
}

// =================== MAPA FIXO DE COLUNAS ===================
const COLUMN_MAP: (keyof Occurrence)[] = [
  "nota",                 // A
  "volumes",              // B
  "tipo",                 // C
  "solicitante",          // D
  "dataNota",             // E
  "dataOcorrencia",       // F
  "transportadora",       // G
  "cliente",              // H
  "destino",              // I
  "estado",               // J
  "pedido",               // K
  "ocorrencia",           // L
  "ultimaOcorrencia",     // M
  "statusCliente",        // N
  "statusTransportadora", // O
  "tracking",             // P
  "obs",                  // Q
  "pendencia",            // R
  "status",               // S
];

function buildRow(occurrence: Occurrence): any[] {
  return COLUMN_MAP.map((field) =>
    occurrence[field] ?? ""
  );
}

// =================== SERVICE ===================
export class GoogleSheetsService {

  // 🔐 PRÓXIMA LINHA REALMENTE VAZIA (SEM PULAR)
  static async getNextEmptyRow(sheetName: string): Promise<number> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetName}'!A:A`,
    });

    const rows = res.data.values || [];
    return rows.length + 1; // linha 1 = header
  }

  // =================== GET ===================
  static async getOccurrences(sheetName: string): Promise<Occurrence[]> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:S`,
    });

    const rows = response.data.values || [];

    return rows
      .map((row, index) => ({ row, rowNumber: index + 2 }))
      .filter(({ row }) => isValidRow(row) && !isHeaderRow(row))

      .map(({ row, rowNumber }) => ({
        id: String(rowNumber),
        nota: row[0],
        volumes: row[1] || "",
        tipo: row[2] || "",
        solicitante: row[3],
        dataNota: excelDateToISO(row[4]),
        dataOcorrencia: excelDateToISO(row[5]),
        transportadora: row[6] || "",
        cliente: row[7] || "",
        destino: row[8] || "",
        estado: row[9] || "",
        pedido: row[10] || "",
        ocorrencia: row[11] || "",
        ultimaOcorrencia: excelDateToISO(row[12]),
        statusCliente: row[13] || "",
        statusTransportadora: row[14] || "",
        tracking: row[15] || "",
        obs: row[16] || "",
        pendencia: row[17] || "",
        status: normalizarStatus(row[18]),
      }));
  }

  // =================== CREATE (SEM append) ===================
  static async createOccurrence(
    sheetName: string,
    occurrence: Occurrence
  ): Promise<Occurrence> {
    const nextRow = await this.getNextEmptyRow(sheetName);

    console.log("➡️ Gravando na linha:", nextRow);

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetName}'!A${nextRow}:S${nextRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [buildRow(occurrence)],
      },
    });

    return occurrence;
  }

  // =================== UPDATE ===================
  static async updateOccurrence(
    sheetName: string,
    id: string,
    occurrence: Occurrence
  ): Promise<Occurrence> {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetName}'!A${id}:S${id}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [buildRow(occurrence)],
      },
    });

    return { ...occurrence, id };
  }

  // =================== DELETE ===================
  static async getSheetIdByName(sheetName: string): Promise<number> {
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = meta.data.sheets?.find(
      s => s.properties?.title === sheetName
    );

    if (!sheet?.properties?.sheetId) {
      throw new Error(`Aba ${sheetName} não encontrada`);
    }

    return sheet.properties.sheetId;
  }

  static async deleteOccurrence(sheetName: string, id: string): Promise<void> {
    const sheetId = await this.getSheetIdByName(sheetName);
    const rowIndex = parseInt(id) - 1;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        }],
      },
    });
  }
}
