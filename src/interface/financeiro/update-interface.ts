import { StatusAgendamento } from "../agendamentos/status-agendamento-interface";

export interface IUpdateFinanceiro {
  id: string; 
  agendamentoId?: string;
  clienteNome?: string;
  valor?: number;
  status?: StatusAgendamento;
  criadoEm?: Date;
  atualizadoEm?: Date;
}