export type Status = "PENDENTE" | "AGUARDANDO" | "EXPEDIDO";
export type Filtro = "TODOS"  | "AGUARDANDO" | "EXPEDIDO" | "NF DISPONIVEIS";

export interface Expedicao {
  id: string;
  nota: number;
  cliente: string;
  dataNota: string;
  volumes: number;
  status: "NF DISPONIVEIS" | "AGUARDANDO" | "EXPEDIDO";
  dataExpedicao: string; // ✅ só quando expedir
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
  status: "PENDENTE";
}
