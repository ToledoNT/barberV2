import axios from "axios";

import { DashboardResponse } from "@/app/interfaces/dashboardInterface";

export class DashboardService {
  private api = axios.create({
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const response = await this.api.get<{
        status: boolean;
        code: number;
        data: DashboardResponse;
        message?: string;
      }>("/api/dashboard");

      if (
        !response.data.status ||
        !response.data.data
      ) {
        throw new Error(
          response.data.message ||
            "Erro ao buscar dados do dashboard"
        );
      }

      return response.data.data;
    } catch (err: any) {
      console.error(
        "DashboardService.getDashboardData error:",
        err
      );

      const status =
        err?.response?.status;

      let message =
        "Erro ao buscar dados do dashboard";

      if (status === 401) {
        message =
          "Sessão expirada. Faça login novamente.";
      }

      if (status === 403) {
        message =
          "Acesso negado: apenas administradores podem acessar o dashboard.";
      }

      throw new Error(message);
    }
  }
}

export const dashboardService =
  new DashboardService();