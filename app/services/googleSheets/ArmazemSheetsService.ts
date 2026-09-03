import { randomUUID } from "crypto";
import { sheets, SPREADSHEET_ID } from "./auth";

export interface ProdutoLinha {
  sku: string;
  descricao: string;
  quantidade: string;
}

export interface ArmazemNota {
  id: string;
  filial: string;
  nota: string;
  Responsavel: string;
  transportadora: string;
  tipoOcorrencia: string;
  dataEntrada48: string;
  dataSaida48: string;
  tracking: string;
  obs: string;
  status: string;
  itens: ProdutoLinha[];
  ocorrencia?: string;
}

const SHEET_NAME = "ARMAZEM 48";

const serializeItens = (itens: ProdutoLinha[]) =>
  (itens || [])
    .map((item) => `${item.sku || ""} | ${item.descricao || ""} | ${item.quantidade || ""}`)
    .join(";;");

const parseItens = (value?: string): ProdutoLinha[] => {
  if (!value) return [];

  return value
    .split(";;")
    .filter(Boolean)
    .map((item) => {
      const [sku = "", descricao = "", quantidade = ""] = item.split("|");
      return {
        sku: sku.trim(),
        descricao: descricao.trim(),
        quantidade: quantidade.trim(),
      };
    });
};

export class ArmazemSheetsService {
  static async getNotas(filial?: string): Promise<ArmazemNota[]> {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A2:Z`,
    });

    const rows = response.data.values || [];

    const notas = rows
      .filter((row) => row[0])
      .map((row) => ({
        id: row[0] || "",
        filial: row[2] || "",
        nota: row[1] || "",
        Responsavel: row[3] || "",
        transportadora: row[4] || "",
        tipoOcorrencia: row[5] || "",
        dataEntrada48: row[6] || "",
        dataSaida48: row[7] || "",
        tracking: row[8] || "",
        obs: row[9] || "",
        status: row[10] || "Pendente",
        itens: parseItens(row[11]),
        ocorrencia: row[12] || "",
      }))
      .filter((nota) => {
        if (!filial) return true;
        return nota.filial.toLowerCase() === filial.toLowerCase();
      });

    return notas;
  }

  static async createNota(filial: string, data: Omit<ArmazemNota, "id" | "filial"> & { filial?: string }) {
    const id = randomUUID();

    const row = [
      id,
      data.nota || "",
      filial,
      data.Responsavel || "",
      data.transportadora || "",
      data.tipoOcorrencia || "",
      data.dataEntrada48 || "",
      data.dataSaida48 || "",
      data.tracking || "",
      data.obs || "",
      data.status || "Pendente",
      serializeItens(data.itens || []),
      data.ocorrencia || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A:Z`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return { ...data, id, filial };
  }

  static async deleteNota(id: string) {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${SHEET_NAME}'!A:Z`,
    });

    const rows = response.data.values || [];
    let rowIndex = -1;

    for (let i = 1; i < rows.length; i += 1) {
      if (rows[i][0] === id) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error("Nota não encontrada");
    }

    const sheetMeta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = sheetMeta.data.sheets?.find(
      (item) => item.properties?.title === SHEET_NAME
    );

    if (!sheet || sheet.properties?.sheetId == null) {
      throw new Error("Aba não encontrada");
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
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
