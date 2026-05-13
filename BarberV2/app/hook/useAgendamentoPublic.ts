"use client";

import { useEffect, useState } from "react";
import { AppointmentPublicService } from "../api/agendamentoPublic";
import { Agendamento } from "../interfaces/agendamentoInterface";
import { Profissional } from "../interfaces/profissionaisInterface";

const service = new AppointmentPublicService();

export function useAgendamentoPublic() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await service.fetchPublicData();

      setProfissionais(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const addAgendamento = async (
    agendamento: Partial<Agendamento>
  ) => {
    try {
      const response = await fetch("/api/agendamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamento),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar agendamento");
      }

      return await response.json();
    } catch (err: any) {
      throw new Error(
        err?.message || "Erro desconhecido ao criar agendamento"
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    profissionais,
    loading,
    error,

    reload: loadData,

    addAgendamento,
  };
}