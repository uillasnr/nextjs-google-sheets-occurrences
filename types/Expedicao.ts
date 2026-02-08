export type Status = "NF DISPONIVEIS" | "AGUARDANDO" | "EXPEDIDO";
export type Filtro = "TODOS" | "NF DISPONIVEIS" | "AGUARDANDO" | "EXPEDIDO";

export interface Expedicao {
  id: string;
  nota: number;
  cliente: string;
  dataNota: string;
  volumes: number;
  status: Status;
  dataExpedicao: string;
  motorista?: string;
  cpf?: string;
  placa?: string;
  romaneio?: string;
}

export interface CadastrationExpedicao {
  id: string;
  nota: number;
  cliente: string;
  dataNota: string;
  volumes: number;
  status: "NF DISPONIVEIS";
}
