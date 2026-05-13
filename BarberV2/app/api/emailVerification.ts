import axios from "axios";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class EmailVerificationService {
  // 🔥 MODIFICADO: agora aceita um terceiro parâmetro opcional "agendamento"
  async enviarCodigo(email: string, nome: string, agendamento?: any): Promise<boolean> {
    try {
      const response = await api.post<
        ResponseTemplateInterface<null>
      >("/emailverify", {
        email,
        nome,
        agendamento,  
      });

      return response.data.status === true;
    } catch (err) {
      console.error("enviarCodigo error:", err);
      return false;
    }
  }

  async verificarCodigo(email: string, codigo: string): Promise<boolean> {
    try {
      const response = await api.put<
        ResponseTemplateInterface<null>
      >("/emailverify", {
        email,
        codigo,
      });

      return response.data.status === true;
    } catch (err) {
      console.error("verificarCodigo error:", err);
      return false;
    }
  }
}