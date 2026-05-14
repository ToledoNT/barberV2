import axios from "axios";

import { HorarioDisponivel } from "../interfaces/agendamentoInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class HorarioService {
  async fetchAllHorarios(): Promise<
    HorarioDisponivel[]
  > {
    try {
      const response = await api.get<
        ResponseTemplateInterface<
          HorarioDisponivel[]
        >
      >("/horario");

      if (
        !response.data.status ||
        !response.data.data
      ) {
        return [];
      }

      return response.data.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async createHorarioDisponivel(
    horario: Partial<HorarioDisponivel>
  ): Promise<
    HorarioDisponivel | HorarioDisponivel[]
  > {
    try {
      const response = await api.post<
        ResponseTemplateInterface<
          | HorarioDisponivel
          | HorarioDisponivel[]
        >
      >("/horario", horario);

      if (
        !response.data.status ||
        !response.data.data
      ) {
        throw new Error(
          response.data.message ||
            "Erro ao criar horário"
        );
      }

      return response.data.data;
    } catch (err: any) {
      console.error(err);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro desconhecido ao criar horário";

      throw new Error(msg);
    }
  }

  async updateHorario(
    id: string,
    horario: Partial<HorarioDisponivel>
  ): Promise<HorarioDisponivel> {
    try {
      const response = await api.put<
        ResponseTemplateInterface<HorarioDisponivel>
      >("/horario", {
        id,
        ...horario,
      });

      if (
        !response.data.status ||
        !response.data.data
      ) {
        throw new Error(
          response.data.message ||
            "Erro ao atualizar horário"
        );
      }

      return response.data.data;
    } catch (err: any) {
      console.error(err);

      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Erro desconhecido ao atualizar horário"
      );
    }
  }

  async deleteHorarioDisponivel(
    id: string
  ): Promise<void> {
    try {
      const response =
        await api.delete<
          ResponseTemplateInterface<null>
        >(`/horario?id=${id}`);

      if (!response.data.status) {
        throw new Error(
          response.data.message ||
            "Erro ao deletar horário"
        );
      }
    } catch (err: any) {
      console.error(err);

      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Erro ao deletar horário"
      );
    }
  }

  async fetchHorarioById(
    id: string
  ): Promise<HorarioDisponivel | null> {
    try {
      const response = await api.get<
        ResponseTemplateInterface<HorarioDisponivel>
      >(`/horario/${id}`);

      if (
        !response.data.status ||
        !response.data.data
      ) {
        return null;
      }

      return response.data.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

async createHorarioIndividual(
  horario: Partial<HorarioDisponivel>
): Promise<HorarioDisponivel> {
  try {
    const response = await api.post<
      ResponseTemplateInterface<HorarioDisponivel>
    >("/horario", horario);

    if (
      !response.data.status ||
      !response.data.data
    ) {
      throw new Error(
        response.data.message ||
          "Falha ao criar horário individual"
      );
    }

    return response.data.data;
  } catch (err: any) {
    console.error(
      "❌ Erro ao criar horário individual:",
      err
    );

    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Erro desconhecido ao criar horário individual";

    throw new Error(msg);
  }
}}