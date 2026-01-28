export type Status = "PENDENTE" | "EXPEDIDO";
export type Filtro = "TODOS" | "PENDENTE" | "EXPEDIDO";

export interface Expedicao {
  id: string;
  nota: number;
  cliente: string;
  dataNota: string;
  volumes: number;
  status: "PENDENTE" | "EXPEDIDO";
  dataExpedicao: string; // ✅ só quando expedir
  motorista?: string;
  cpf?: string;
  placa?: string;
}

export interface CadastrationExpedicao {
  id: string;
  nota: number;
  cliente: string;
  dataNota: string;
  volumes: number;
  status: "PENDENTE";
}
