export type Occurrence = {
  id?: string;
  nota: string;
  volumes: string | number;
  tipo: string;
  solicitante: string;
  dataNota: string;
  dataOcorrencia: string;
  transportadora: string;
  cliente: string;
  destino: string;
  estado: string;
  pedido: string;
  ocorrencia: string;
  ultimaOcorrencia: string;
  statusCliente: string;
  statusTransportadora: string;
  tracking: string;
  obs: string;
  pendencia: string;
  status: string;
};

export const TIPO_OCORRENCIA_MAP: Record<string, string> = {
  "1": "Falta de Volumes",
  "2": "Falta de Itens",
  "3": "Troca de Volume",
  "4": "Erro de Estoque",
  "5": "Extravio",
  "6": "Volumes Avariados",
  "7": "Cliente não recebeu o pedido",
};
