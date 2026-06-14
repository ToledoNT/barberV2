import axios from "axios";

import { ResponseTemplateInterface } from "app/interfaces/response-templete-interface";
import { BarbeiroDadosResponse, Profissional } from "app/interfaces/profissionaisInterface";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true,
});

export class ProfissionalService {
  // ---------------------------
  // LISTAR PROFISSIONAIS
  // ---------------------------
  async fetchProfissionais(
    signal?: AbortSignal
  ): Promise<Profissional[]> {
    try {
    const res = await api.get<
  ResponseTemplateInterface<Profissional[]>
>("/profissional", {
  signal,
} as any);
      return res.data.data ?? [];
    } catch (err: any) {
      if (
        err.name === "CanceledError" ||
        err.name === "AbortError"
      )
        return [];

      console.error(
        "Erro ao buscar profissionais:",
        err
      );

      return [];
    }
  }

  // ---------------------------
  // CRIAR PROFISSIONAL
  // ---------------------------
  async createProfissional(
    data: Partial<Profissional>
  ): Promise<Profissional> {
    try {
      const res =
        await api.post<
          ResponseTemplateInterface<Profissional>
        >("/profissional", data);

      if (!res.data.status)
        throw new Error(res.data.message);

      return res.data.data!;
    } catch (err: any) {
      console.error(
        "Erro ao criar profissional:",
        err
      );

      throw new Error(
        err.response?.data?.message ||
          err.message
      );
    }
  }

  // ---------------------------
  // ATUALIZAR PROFISSIONAL
  // ---------------------------
  async updateProfissional(
    id: string,
    data: Partial<Profissional>
  ): Promise<Profissional | null> {
    try {
      const res =
        await api.put<
          ResponseTemplateInterface<Profissional>
        >("/profissional", {
          id,
          ...data,
        });

      if (!res.data.status)
        throw new Error(res.data.message);

      return res.data.data ?? null;
    } catch (err: any) {
      console.error(
        "Erro ao atualizar profissional:",
        err
      );

      return null;
    }
  }

  // ---------------------------
  // DELETAR PROFISSIONAL
  // ---------------------------
  async deleteProfissional(
    id: string
  ): Promise<ResponseTemplateInterface<any>> {
    try {
      const res =
        await api.delete<
          ResponseTemplateInterface<any>
        >(`/profissional?id=${id}`);

      return res.data;
    } catch (err: any) {
      console.error(
        "Erro ao deletar profissional:",
        err
      );

      throw new Error(
        err.response?.data?.message ||
          err.message
      );
    }
  }

  // ---------------------------
  // HORÁRIOS + PROCEDIMENTOS
  // ---------------------------
  async fetchHorariosByProfissional(
    profissionalId: string
  ): Promise<BarbeiroDadosResponse> {
    try {
      const res =
        await api.get<
          ResponseTemplateInterface<BarbeiroDadosResponse>
        >(
          `/profissional?barbeiroId=${profissionalId}`
        );

      return {
        barbeiroId:
          res.data.data?.barbeiroId ??
          profissionalId,
        horarios:
          res.data.data?.horarios ?? [],
        procedimentos:
          res.data.data?.procedimentos ?? [],
      };
    } catch (err) {
      console.error(
        "Erro ao buscar horários do barbeiro:",
        err
      );

      return {
        barbeiroId: profissionalId,
        horarios: [],
        procedimentos: [],
      };
    }
  }
}