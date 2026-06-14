import { Dispatch, SetStateAction } from "react";

export interface Procedimento {
  id: string;
  nome: string;
  valor: number;
  duracaoMinutos?: number;
  label?: string; 
}

interface ServicoCarrinho {
  id: string;
  nome: string;
  valor: number;
}

interface HorarioCarrinho {
  id: string;
  data: string;
  inicio: string;
  fim: string;
}

interface ProfissionalCarrinho {
  id: string;
  nome: string;
}

export interface ItemCarrinho {
  servico: ServicoCarrinho;

  horario: HorarioCarrinho;

  profissional?: ProfissionalCarrinho;

  pessoaGrupo?: {
    id: string;
    nome: string;

    profissional?: ProfissionalCarrinho;
  };
}

export interface Barbeiro {
  id: string;
  nome: string;
  horarios: string[];
  procedimentos?: Procedimento[];
  diasDisponiveis?: string[]; 
}

export enum StatusAgendamento {
  PENDENTE = "Pendente",
  AGENDADO = "Agendado",
  EM_ANDAMENTO = "Em Andamento",
  CONCLUIDO = "Concluído",
  CANCELADO = "Cancelado",
  NAO_COMPARECEU = "Não Compareceu",
}

export interface AgendamentoFormData {
  nome: string;
  telefone: string;
  email: string;
  data: string;
  hora: string;
  servico: string;
  barbeiro: string;
}

export interface Agendamento {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  data: string;
  inicio: string;
  fim: string;
  hora?: string;
  status?: StatusAgendamento;
  criadoEm?: string;
  atualizadoEm?: string;
  servicoId?: string;
  servicoNome?: string;
  servicoPreco?: number;
  servico?: string;
  profissionalId?: string;
  profissionalNome?: string;
  barbeiro?: string;
  procedimentoId?: string;
}

export interface AgendamentoForm {
  nome: string;
  telefone: string;
  email: string;
  barbeiro: string;
  data: Date | null;
  hora: string;
  servico: string;
  status: StatusAgendamento;
}

export interface HorarioDisponivel {
  id?: string;
  profissional: Barbeiro; 
  data: string;
  inicio: string;
  fim: string;
  disponivel: boolean;
  label: string;
}

export type HorarioParaGerar = {
  barbeiro: string;
  data: string;
}

export interface HorariosProps {
  horarios: HorarioDisponivel[];
  novoHorario: Omit<HorarioDisponivel, "id">;
  setNovoHorario: Dispatch<SetStateAction<Omit<HorarioDisponivel, "id">>>;
  addHorario: (novo: HorarioDisponivel) => void;
  updateHorario: (id: string, atualizado: Partial<HorarioDisponivel>) => void;
  removeHorario: (id: string) => void;
}

export interface AgendamentoPrivadoFormProps {
  agendamento?: Agendamento | null;
  onSave: (a: Agendamento) => Promise<void> | void;
  onCancel: () => void;
  barbeiros: Barbeiro[];
  procedimentos?: Procedimento[];
  horarios: HorarioDisponivel[]; 
}


export interface AgendamentosGridProps {
  agendamentos: Agendamento[];
  onStatusChange?: (
    id: string,
    status: StatusAgendamento,
    buttonRef?: HTMLButtonElement | null
  ) => void | Promise<void>;
}


export interface AgendamentoHorarioProps {
  horarios: HorarioDisponivel[];
  onToggleDisponivel: (h: HorarioDisponivel) => void;
  onRemoveHorario: (id?: string) => void;
}

export interface AgendamentosListProps {
  agendamentos: Agendamento[];
  onEdit: (a: Agendamento) => Promise<void> | void;
  onConcluir: (a: Agendamento) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  getStatusColor: (status: StatusAgendamento) => string;
  formatarDataParaDisplay: (data: string) => string;
  formatarHora: (hora: string) => string;
}

export interface GerenciarAgendamentosProps {
  agendamentos: Agendamento[];
  horarios: HorarioDisponivel[];
  onConcluir: (a: Agendamento) => Promise<void>;
  onDelete: (id?: string) => Promise<void>;
  getStatusColor: (status: StatusAgendamento) => string;
  formatarDataParaDisplay: (dataISO: string) => string;
  formatarHora?: (hora?: string) => string; 
}

export interface AgendamentoFrontend {
  id?: string;           
  nome: string;
  telefone: string;
  email: string;
  data: string;          
  hora?: string;
  servico: string;
  profissional: string;
  inicio?: string;
  fim?: string;
  status?: StatusAgendamento;
}

export interface Column {
  header: string;
  accessor: string; 
}

export interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
}

export interface NotificationState {
  isOpen: boolean;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "warning" | "error";
  onConfirm: (() => void) | null;
}

export interface TabsState {
  agendamento: "criar" | "gerenciar";
  horario: "exibir" | "criar";
}

export interface FiltrosState {
  status: "todos" | StatusAgendamento;
  data: string;
  barbeiro: string;
}