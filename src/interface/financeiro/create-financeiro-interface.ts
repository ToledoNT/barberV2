import { StatusAgendamento } from "app/interfaces/agendamentoInterface";

export interface ICreateFinanceiro {
  id?: string;
  agendamentoId?: string;
  profissionalId?: string;
  profissionalNome?: string;
  clienteNome: string;
  valor: number;
  status?: "Agendado" | "Em Andamento" | "Concluído" | "Cancelado" | "Não Compareceu" | "Pendente" | "Pago";  criadoEm?: Date;
  atualizadoEm?: Date;
}