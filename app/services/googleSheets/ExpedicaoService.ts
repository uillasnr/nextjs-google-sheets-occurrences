import { randomUUID } from "node:crypto";
import { sheets, SPREADSHEET_ID } from "./auth";

export interface RegistroExpedicao {
  id?: string;
  nota: string;
  dataNota: string;
  cliente: string;
  volumes: string | number;
  status: "NF DISPONIVEIS" | "AGUARDANDO" | "EXPEDIDO";

  motorista?: string;
  cpf?: string;
  placa?: string;
}

export class ExpedicaoService {
  private static SHEET_NAME = "EXPEDICAO";

  /**
   * ✅ CADASTRAR NF
   * ❌ NÃO cria data
   * ❌ NÃO cria motorista / cpf / placa
   */
  static async criar(data: RegistroExpedicao) {
    const id = randomUUID();

    const row = [
    id,               // A - ID
    data.nota,        // B - NF
    data.cliente,     // C - Cliente
    data.dataNota,    // D - Data Nota ✅
    data.volumes,     // E - Volumes
    "",               // F - Motorista
    "",               // G - CPF
    "",               // H - Placa
    "",               // I - Data Expedição
    "NF DISPONIVEIS", // J - Status
  ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${this.SHEET_NAME}'!A:J`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return {
      id,
      nota: data.nota,
      cliente: data.cliente,
      dataNota: data.dataNota,
      volumes: data.volumes,
      status: "NF DISPONIVEIS",
      dataExpedicao: "",
    };
  }

  /**
   * Mover NF para AGUARDANDO (sem dados de transporte ainda)
   */
  static async aguardar(id: string) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${this.SHEET_NAME}'!A2:A`,
    });

    const rows = res.data.values || [];
    const index = rows.findIndex((row) => row[0] === id);

    if (index === -1) {
      throw new Error("Registro nao encontrado");
    }

    const rowNumber = index + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${this.SHEET_NAME}'!J${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["AGUARDANDO"]],
      },
    });

    return { id, status: "AGUARDANDO" };
  }

  /**
   * EXPEDIR NF
   * Atualiza motorista / cpf / placa / data
   */
  static async expedir(id: string, data: RegistroExpedicao) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${this.SHEET_NAME}'!A2:A`,
  });

  const rows = res.data.values || [];
  const index = rows.findIndex((row) => row[0] === id);

  if (index === -1) {
    throw new Error("Registro não encontrado");
  }

  const rowNumber = index + 2;
  const dataExpedicao = new Date().toLocaleString("pt-BR");

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${this.SHEET_NAME}'!F${rowNumber}:J${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        data.motorista,
        data.cpf,
        data.placa,
        dataExpedicao,
        "EXPEDIDO",
      ]],
    },
  });

  return {
    id,
    motorista: data.motorista,
    cpf: data.cpf,
    placa: data.placa,
    dataExpedicao,
    status: "EXPEDIDO",
  };
}

  /**
   * 📋 LISTAR EXPEDIÇÕES
   */
 static async listar() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${this.SHEET_NAME}'!A2:J`,
  });

  const rows = res.data.values || [];

  return rows.map((row) => {
    // Backward compat: map old PENDENTE to NF DISPONIVEIS
    let status = row[9] || "NF DISPONIVEIS";
    if (status === "PENDENTE") status = "NF DISPONIVEIS";

    return {
      id: row[0],
      nota: row[1],
      cliente: row[2],
      dataNota: row[3],
      volumes: row[4],
      motorista: row[5] || "",
      cpf: row[6] || "",
      placa: row[7] || "",
      dataExpedicao: row[8] || "",
      status,
    };
  });
}
}

