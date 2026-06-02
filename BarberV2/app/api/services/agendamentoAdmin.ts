import axios from "axios";
import { Agendamento } from "../../interfaces/agendamentoInterface";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class AppointmentService {
  // ---------------- GET ALL / GET HORÁRIOS (MESMA ROTA) ----------------
  async fetchAppointments(): Promise<Agendamento[]> {
    try {
      const response = await api.get<
        ResponseTemplateInterface<Agendamento[]>
      >("/agendamento");

      if (!response.data.status || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (err) {
      console.error("fetchAppointments error:", err);
      return [];
    }
  }

  // ---------------- CREATE ----------------
  async createAppointment(
    data: Partial<Agendamento>
  ): Promise<Agendamento> {
    try {
      const response = await api.post<
        ResponseTemplateInterface<Agendamento>
      >("/agendamento", data);

      if (!response.data.status || !response.data.data) {
        throw new Error(response.data.message || "Erro ao criar agendamento");
      }

      return response.data.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Erro desconhecido ao criar agendamento";

      throw new Error(message);
    }
  }

  // ---------------- UPDATE ----------------
  async updateAppointment(
    id: string,
    data: Partial<Agendamento>
  ): Promise<Agendamento | null> {
    try {
      const response = await api.put<
        ResponseTemplateInterface<Agendamento>
      >("/agendamento", { id, ...data });

      if (!response.data.status || !response.data.data) {
        return null;
      }

      return response.data.data;
    } catch (err) {
      console.error("updateAppointment error:", err);
      return null;
    }
  }

  // ---------------- DELETE ----------------
  async deleteAppointment(id: string): Promise<void> {
    try {
      const response = await api.delete<
        ResponseTemplateInterface<null>
      >(`/agendamento?id=${id}`);

      if (!response.data.status) {
        throw new Error(response.data.message || "Erro ao deletar agendamento");
      }
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao deletar agendamento"
      );
    }
  }

  // ---------------- GET BY ID ----------------
  async fetchAppointmentById(id: string): Promise<Agendamento | null> {
    try {
      const response = await api.get<
        ResponseTemplateInterface<Agendamento>
      >(`/agendamento/${id}`);

      if (!response.data.status || !response.data.data) {
        return null;
      }

      return response.data.data;
    } catch (err) {
      console.error("fetchAppointmentById error:", err);
      return null;
    }
  }

  async fetchHorariosDisponiveis(
    barbeiro: string,
    data: string
  ): Promise<any> {
    try {
      const response = await api.get<
        ResponseTemplateInterface<any>
      >("/agendamento", {
        params: {
          barbeiro,
          data,
        },
      });

      if (!response.data.status || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (err) {
      console.error("fetchHorariosDisponiveis error:", err);
      return [];
    }
  }
}
