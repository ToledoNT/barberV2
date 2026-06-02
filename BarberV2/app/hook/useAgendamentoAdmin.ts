"use client";

import { useState, useEffect } from "react";
import {
  Agendamento,
  HorarioDisponivel,
  Barbeiro,
  Procedimento,
  StatusAgendamento,
} from "../interfaces/agendamentoInterface";

import { ProfissionalService } from "../api/services/profissionaisAdmin";
import { AppointmentService } from "../api/services/agendamentoAdmin";
import { HorarioService } from "../api/services/horarioAdmin";
import { Profissional } from "../../app/interfaces/profissionaisInterface";

const appointmentService = new AppointmentService();
const profissionalService = new ProfissionalService();
const horarioService = new HorarioService();

/**
 * 🔥 NORMALIZADOR DE STATUS (ANTI-BUG)
 */
const normalizeStatus = (status?: string): StatusAgendamento => {
  const s = String(status || "").trim().toUpperCase();

  switch (s) {
    case "PENDENTE":
      return StatusAgendamento.PENDENTE;

    case "AGENDADO":
      return StatusAgendamento.AGENDADO;

    case "EM_ANDAMENTO":
      return StatusAgendamento.EM_ANDAMENTO;

    case "CONCLUIDO":
    case "CONCLUÍDO":
      return StatusAgendamento.CONCLUIDO;

    case "CANCELADO":
      return StatusAgendamento.CANCELADO;

    case "NAO_COMPARECEU":
      return StatusAgendamento.NAO_COMPARECEU;

    default:
      return StatusAgendamento.PENDENTE;
  }
};

type FormState = {
  barbeiro: string;
  data: Date | null;
};

export function useAgendamentosAdmin() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [procedimentosBarbeiro, setProcedimentosBarbeiro] = useState<Procedimento[]>([]);
  const [form, setForm] = useState<FormState>({ barbeiro: "", data: null });

  useEffect(() => {
    fetchAgendamentos();
    fetchBarbeiros();
    fetchTodosHorarios();
  }, []);

 
  const fetchBarbeiros = async () => {
    const response = await profissionalService.fetchProfissionais();

    if (Array.isArray(response)) {
      setBarbeiros(
        response.map((b: Profissional) => ({
          id: b.id,
          nome: b.nome,
          horarios: Array.isArray(b.horarios)
            ? b.horarios.map((h: any) => (typeof h === "string" ? h : h.id || ""))
            : [],
        }))
      );
    }
  };

  const fetchAgendamentos = async () => {
    const data = await appointmentService.fetchAppointments();

    setAgendamentos(
      (data || []).map((a: any) => ({
        ...a,
        status: normalizeStatus(a.status),
      }))
    );
  };

  const fetchTodosHorarios = async () => {
    const data = await horarioService.fetchAllHorarios();
    setHorarios(data || []);
  };

  const fetchBarbeiroDados = async (barbeiroId: string) => {
    if (!barbeiroId) {
      setHorarios([]);
      setProcedimentosBarbeiro([]);
      return;
    }

    const res = await profissionalService.fetchHorariosByProfissional(barbeiroId);

    const horariosConvertidos = res.horarios
      .filter((h: any) => !!h.id)
      .map((h: any) => ({
        ...h,
        label: h.label ?? `${h.inicio} - ${h.fim}`,
        disponivel: h.disponivel ?? true,
      }));

    const procedimentosConvertidos = res.procedimentos
      .filter((p: any) => !!p.id)
      .map((p: any) => ({
        ...p,
        label: p.label ?? `${p.nome} - R$${p.valor.toFixed(2)}`,
      }));

    setHorarios(horariosConvertidos);
    setProcedimentosBarbeiro(procedimentosConvertidos);
    setForm((prev) => ({ ...prev, hora: "", servico: "" }));
  };

  const addAgendamento = async (a: Agendamento) => {
    const newA = await appointmentService.createAppointment(a);

    if (newA?.id) {
      setAgendamentos((prev) => [
        ...prev,
        { ...newA, status: normalizeStatus(newA.status) },
      ]);
    }
  };

  const updateAgendamento = async (id: string, a: Partial<Agendamento>) => {
    await appointmentService.updateAppointment(id, a);

    setAgendamentos((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...a, status: normalizeStatus(a.status || item.status) }
          : item
      )
    );
  };

  const removeAgendamento = async (id: string) => {
    await appointmentService.deleteAppointment(id);
    setAgendamentos((prev) => prev.filter((item) => item.id !== id));
  };

  const addHorario = async (h: Partial<HorarioDisponivel>) => {
    const response = await horarioService.createHorarioDisponivel(h);

    const normalizeHorario = (horario: HorarioDisponivel) => ({
      ...horario,
      profissional: {
        id: horario.profissional?.id || h.profissional?.id || "",
        nome: horario.profissional?.nome || h.profissional?.nome || "Sem profissional",
        horarios: horario.profissional?.horarios || h.profissional?.horarios || [],
      },
      label: horario.label || `${horario.inicio || ""} - ${horario.fim || ""}`,
      disponivel: horario.disponivel ?? false,
    });

    if (Array.isArray(response)) {
      setHorarios((prev) => [...prev, ...response.map(normalizeHorario)]);
    } else {
      setHorarios((prev) => [...prev, normalizeHorario(response)]);
    }

    setTimeout(fetchTodosHorarios, 500);

    return response;
  };

  const createHorarioIndividual = async (h: Partial<HorarioDisponivel>) => {
    const response = await horarioService.createHorarioIndividual(h);
    const horarioCriado = Array.isArray(response) ? response[0] : response;

    setHorarios((prev) => [...prev, horarioCriado]);
    return horarioCriado;
  };

  const removeHorario = async (id: string) => {
    await horarioService.deleteHorarioDisponivel(id);
    setHorarios((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHorarioDisponivel = async (h: HorarioDisponivel) => {
    if (!h.id) return;

    const updated = await horarioService.updateHorario(h.id, {
      disponivel: !h.disponivel,
    });

    setHorarios((prev) =>
      prev.map((item) =>
        item.id === h.id ? { ...item, disponivel: updated.disponivel } : item
      )
    );
  };

  const handleUpdateStatusAgendamento = async (id: string, status: StatusAgendamento) => {
    await appointmentService.updateAppointment(id, { id, status });

    setAgendamentos((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: normalizeStatus(status) } : a
      )
    );
  };

  return {
    agendamentos,
    addAgendamento,
    updateAgendamento,
    removeAgendamento,
    horarios,
    addHorario,
    removeHorario,
    toggleHorarioDisponivel,
    barbeiros,
    procedimentosBarbeiro,
    form,
    setForm,
    fetchBarbeiros,
    fetchAgendamentos,
    fetchTodosHorarios,
    fetchBarbeiroDados,
    handleUpdateStatusAgendamento,
    createHorarioIndividual,
  };
}