import { google } from "googleapis";
import type { Occurrence } from "@/types/occurrence";

// Configuração das credenciais do Google Sheets
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
  // Lançar um erro direto no ambiente de desenvolvimento
  console.error(
    "ERRO DE CONFIGURAÇÃO: Variável GOOGLE_SHEET_ID está faltando no .env.local!"
  );
  throw new Error(
    "A ID da planilha Google Sheets não foi encontrada nas variáveis de ambiente."
  );
}
const SHEET_NAME = "Ocorrencias";

// Função auxiliar para normalizar status
function normalizarStatus(status: string): string {
  if (!status) return "Pendente";
  const s = status.toUpperCase();
  if (s.includes("RESOLVIDO")) return "Resolvido";
  if (s.includes("ABERTO") || s.includes("ANDAMENTO")) return "Em Andamento";
  if (s.includes("CANCEL")) return "Cancelado";
  return "Pendente";
}

// Função auxiliar para converter data do Excel
function excelDateToISO(value: any): string {
  if (!value) return "";
  if (typeof value === "number") {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    return date.toISOString().split("T")[0];
  }
  return value;
}

function isValidRow(row: any[]): boolean {
  return (
    row[0]?.toString().trim() && // nota
    row[3]?.toString().trim() && // solicitante
    row[4]?.toString().trim() // dataNota
  );
}

export class GoogleSheetsService {
  // Buscar todas as ocorrências
  static async getOccurrences(): Promise<Occurrence[]> {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:T`,
      });

      const rows = response.data.values || [];

      return rows
        .map((row, index) => ({ row, rowNumber: index + 2 }))
        .filter(({ row }) => isValidRow(row))
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
          status: normalizarStatus(row[13]),
        }));
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
      throw new Error("Falha ao buscar dados do Google Sheets");
    }
  }

  // Criar nova ocorrência
  static async createOccurrence(occurrence: Occurrence): Promise<Occurrence> {
    try {
      // 🔍 QUAL PLANILHA
      const meta = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });
      console.log("📊 PLANILHA USADA:", meta.data.properties?.title);

      const values = [
        [
          occurrence.nota,
          occurrence.volumes,
          occurrence.tipo,
          occurrence.solicitante,
          occurrence.dataNota,
          occurrence.dataOcorrencia,
          occurrence.transportadora,
          occurrence.cliente,
          occurrence.destino,
          occurrence.estado,
          occurrence.pedido,
          occurrence.ocorrencia,
          occurrence.ultimaOcorrencia,
          occurrence.statusCliente,
          occurrence.statusTransportadora,
          occurrence.tracking,
          occurrence.obs,
          occurrence.pendencia,
          occurrence.status,
        ],
      ];

      const result = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:T`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
        includeValuesInResponse: true,
      });
      console.log(
        "🔗 LINK DA PLANILHA:",
        `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
      );

      console.log("✅ DADOS INSERIDOS EM:", result.data.updates?.updatedRange);

      return occurrence;
    } catch (error) {
      console.error("❌ ERRO AO CRIAR OCORRÊNCIA:", error);
      throw error;
    }
  }

  // Atualizar ocorrência existente
  static async updateOccurrence(
    id: string,
    occurrence: Occurrence
  ): Promise<Occurrence> {
    try {
      const values = [
        [
          occurrence.nota,
          occurrence.volumes,
          occurrence.tipo,
          occurrence.solicitante,
          occurrence.dataNota,
          occurrence.dataOcorrencia,
          occurrence.transportadora,
          occurrence.cliente,
          occurrence.destino,
          occurrence.estado,
          occurrence.pedido,
          occurrence.ocorrencia,
          occurrence.ultimaOcorrencia,
          occurrence.statusCliente,
          occurrence.statusTransportadora,
          occurrence.tracking,
          occurrence.obs,
          occurrence.pendencia,
          occurrence.status,
        ],
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${id}:T${id}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });

      return { ...occurrence, id };
    } catch (error) {
      console.error("Erro ao atualizar ocorrência:", error);
      throw new Error("Falha ao atualizar ocorrência no Google Sheets");
    }
  }

  // Deletar ocorrência
  static async deleteOccurrence(id: string): Promise<void> {
    try {
      const rowIndex = parseInt(id) - 1; // Converter de linha do sheet para índice

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0, // ID da aba (0 é a primeira aba)
                  dimension: "ROWS",
                  startIndex: rowIndex,
                  endIndex: rowIndex + 1,
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error("Erro ao deletar ocorrência:", error);
      throw new Error("Falha ao deletar ocorrência no Google Sheets");
    }
  }
}
