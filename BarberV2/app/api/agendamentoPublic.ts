// services/AppointmentPublicService.ts
import axios from "axios";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { Profissional } from "../interfaces/profissionaisInterface";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ---------------- SERVICE ----------------
export class AppointmentPublicService {
  async fetchPublicData(): Promise<Profissional[]> {
    try {
      const response = await api.get<
        ResponseTemplateInterface<Profissional[]>
      >("/agendamentodata");

      if (!response.data.status || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (err) {
      console.error("fetchPublicData error:", err);
      return [];
    }
  }
}