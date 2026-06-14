import { ResponseTemplateInterface } from "app/interfaces/response-templete-interface";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class EmailVerificationService {
  async enviarCodigo(
    email: string,
    nome: string,
    agendamento?: any
  ): Promise<ResponseTemplateInterface<null>> {
    try {
      const response = await api.post<ResponseTemplateInterface<null>>(
        "/emailverify",
        {
          email,
          nome,
          agendamento,
        }
      );

      return response.data;
    } catch (err: any) {
      console.error("enviarCodigo error:", err);

      return {
        status: false,
        code: err?.response?.status || 500,
        message:
          err?.response?.data?.message || "Erro ao enviar código",
        data: null,
      };
    }
  }

  async verificarCodigo(
    email: string,
    codigo: string
  ): Promise<ResponseTemplateInterface<null>> {
    try {
      const response = await api.put<ResponseTemplateInterface<null>>(
        "/emailverify",
        {
          email,
          codigo,
        }
      );

      return response.data;
    } catch (err: any) {
      console.error("verificarCodigo error:", err);

      return {
        status: false,
        code: err?.response?.status || 500,
        message:
          err?.response?.data?.message || "Erro ao verificar código",
        data: null,
      };
    }
  }
}