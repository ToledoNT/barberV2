import axios from "axios";

import { IFinanceiro } from "app/interfaces/financeiroInterface";
import { ResponseTemplateInterface } from "app/interfaces/response-templete-interface";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export class FinanceiroService {
  async fetchFinanceiros(): Promise<IFinanceiro[]> {
    try {
      const res =
        await api.get<ResponseTemplateInterface<IFinanceiro[]>>(
          "/api/financeiro"
        );

      if (!res.data.status) {
        throw new Error(
          res.data.message ||
            "Erro ao buscar lançamentos financeiros."
        );
      }

      return res.data.data || [];
    } catch (err: any) {
      const status = err?.response?.status;

      let message = "Erro ao buscar lançamentos financeiros.";

      if (status === 401) {
        message = "Sessão expirada. Faça login novamente.";
      }

      if (status === 403) {
        message =
          "Acesso negado: apenas administradores podem acessar o financeiro.";
      }

      throw new Error(message);
    }
  }
}