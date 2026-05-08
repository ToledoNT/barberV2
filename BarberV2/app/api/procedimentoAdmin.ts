import axios from "axios";
import { Procedimento } from "../interfaces/profissionaisInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class ProcedimentoService {
  // ---------------- GET ALL ----------------
  async fetchProcedimentos(): Promise<Procedimento[]> {
    try {
      const response = await api.get<
        ResponseTemplateInterface<Procedimento[]>
      >("/procedimento");

      if (!response.data.status || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (err) {
      console.error(
        "Erro ao buscar procedimentos:",
        err
      );
      return [];
    }
  }

  // ---------------- GET BY ID ----------------
  async fetchProcedimentoById(
    id: string
  ): Promise<Procedimento | null> {
    try {
      const response = await api.get<
        ResponseTemplateInterface<Procedimento>
      >(`/procedimento/${id}`);

      if (!response.data.status || !response.data.data) {
        return null;
      }

      return response.data.data;
    } catch (err) {
      console.error(
        "Erro ao buscar procedimento:",
        err
      );
      return null;
    }
  }

  // ---------------- CREATE ----------------
  async createProcedimento(
    data: Partial<Procedimento>
  ): Promise<Procedimento> {
    try {
      const response = await api.post<
        ResponseTemplateInterface<Procedimento>
      >("/procedimento", data);

      if (!response.data.status || !response.data.data) {
        throw new Error(
          response.data.message ||
            "Erro ao criar procedimento"
        );
      }

      return response.data.data;
    } catch (err: any) {
      console.error(
        "Erro ao criar procedimento:",
        err
      );

      throw new Error(
        err.response?.data?.message ||
          "Erro ao criar procedimento"
      );
    }
  }

  // ---------------- UPDATE ----------------
  async updateProcedimento(
    id: string,
    data: Partial<Procedimento>
  ): Promise<Procedimento | null> {
    try {
      const response = await api.put<
        ResponseTemplateInterface<Procedimento>
      >(`/procedimento/${id}`, data);

      if (!response.data.status || !response.data.data) {
        throw new Error(
          response.data.message ||
            "Erro ao atualizar procedimento"
        );
      }

      return response.data.data;
    } catch (err) {
      console.error(
        "Erro ao atualizar procedimento:",
        err
      );

      return null;
    }
  }

  // ---------------- DELETE ----------------
  async deleteProcedimento(
    id: string
  ): Promise<void> {
    try {
      const response = await api.delete<
        ResponseTemplateInterface<null>
      >(`/procedimento/${id}`);

      if (!response.data.status) {
        throw new Error(
          response.data.message ||
            "Erro ao deletar procedimento"
        );
      }
    } catch (err: any) {
      console.error(
        "Erro ao deletar procedimento:",
        err
      );

      throw new Error(
        err.response?.data?.message ||
          "Erro ao deletar procedimento"
      );
    }
  }
}