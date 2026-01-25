import type { Occurrence } from "@/types/occurrence";

export const COLUMN_MAP: (keyof Occurrence)[] = [
  "id",                  // A
  "nota",                // B
  "volumes",             // C
  "tipo",                // D
  "solicitante",         // E
  "dataNota",            // F
  "dataOcorrencia",      // G
  "transportadora",      // H
  "cliente",             // I
  "destino",             // J
  "estado",              // K
  "pedido",              // L
  "ocorrencia",          // M
  "ultimaOcorrencia",    // N
  "statusCliente",       // O
  "statusTransportadora",// P
  "tracking",            // Q
  "obs",                 // R
  "pendencia",           // S
  "status",              // T
  "recebedorNome",       // U
  "recebedorCpf",        // V
  "recebedorPlaca",      // W
  "dataRetirada",        // X
];
