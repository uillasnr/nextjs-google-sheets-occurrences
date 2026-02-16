import { z } from "zod";

// Schema para cadastro de Nota Fiscal
export const cadastroNFSchema = z.object({
  nota: z
    .string()
    .min(1, "Número da NF é obrigatório")
    .refine((val) => !isNaN(Number(val)), "Deve ser um número inteiro")
    .refine((val) => Number(val) > 0, "Deve ser maior que 0")
    .transform((val) => Number(val)),
  cliente: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(100, "Máximo 100 caracteres")
    .trim(),
  dataNota: z
    .string()
    .min(1, "Data da nota é obrigatória")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }, "Data não pode ser no futuro"),
  volumes: z
    .string()
    .min(1, "Quantidade de volumes é obrigatória")
    .refine((val) => !isNaN(Number(val)), "Deve ser um número inteiro")
    .refine((val) => Number(val) > 0, "Deve ser maior que 0")
    .transform((val) => Number(val)),
});

export type CadastroNFData = z.infer<typeof cadastroNFSchema>;

// Schema para motorista aguardando retirada
export const aguardarSchema = z.object({
  motorista: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(100, "Máximo 100 caracteres")
    .trim(),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine((val) => {
      const apenasNumeros = val.replace(/\D/g, "");
      return apenasNumeros.length === 11;
    }, "CPF deve ter exatamente 11 dígitos")
    .transform((val) => val.replace(/\D/g, "")),
  placa: z
    .string()
    .min(1, "Placa é obrigatória")
    .refine((val) => {
      const apenasAlfanum = val.replace(/[^A-Z0-9]/gi, "");
      return apenasAlfanum.length === 7;
    }, "Placa deve ter exatamente 7 caracteres")
    .transform((val) => val.replace(/[^A-Z0-9]/gi, "").toUpperCase()),
});

export type AguardarData = z.infer<typeof aguardarSchema>;
