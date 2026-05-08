// services/TransporteSheetsService.ts

import { sheets, SPREADSHEET_ID } from "./auth";
import type { Transporte } from "@/types/transporte";

export class TransporteSheetsService {
  static async getBraspres(): Promise<Transporte[]> {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Braspress'!A:AD`, // ✅ pega tudo corretamente
    });

    const rows = (res.data.values || []).slice(1);

    return rows.map((row) => ({
      notaFiscal: row[0] || "",
      numConhecimento: row[1] || "",
      numPedido: row[2] || "",
      cnpjRemetente: row[3] || "",
      remetente: row[4] || "",
      destinatario: row[6] || "",
      dataEmissao: row[7] || "",
      previsaoEntrega: row[10] || "",
      status: row[11] || "",
      ultimaOcorrencia: row[12] || "",
      dataOcorrencia: row[13] || "",
      modal: row[14] || "",
      filialOrigem: row[15] || "",
      cidadeOrigem: row[16] || "",
      ufOrigem: row[17] || "",
      filialDestino: row[18] || "",
      cidadeDestino: row[19] || "",
      ufDestino: row[20] || "",
      valorFrete: row[21] || "",
      peso: row[23] || "",
      volume: row[24] || "",
      valorMercadoria: row[25] || "",
      mes: row[27] || "",
    }));
  }
}
