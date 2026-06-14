import { StatusAgendamento } from "app/interfaces/agendamentoInterface";

export interface IUpdateAppointment {
  id: string;              
  nome?: string;
  telefone?: string;
  email?: string;
  data?: string;
  hora?: string;           
  servico?: string;
  profissional?: string;
  status?: StatusAgendamento;
  inicio?: string;
  fim?: string;
}