import {
  LoginData,
  LoginResult,
  VerifyTokenResponse,
} from "@/app/interfaces/loginInterface";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class AuthService {
  // ---------------- LOGIN ----------------
  async login(data: LoginData): Promise<LoginResult> {
    try {
      // FIX: rota correta /api/user (login)
      const response = await api.post<{
        status: boolean;
        data?: LoginResult;
        message?: string;
      }>("/user", data);

      if (!response.data.status || !response.data.data) {
        throw new Error(
          response.data.message || "Erro ao realizar login"
        );
      }

      const role = response.data.data.role;

      localStorage.setItem("role", role);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );

      return response.data.data;
    } catch (err) {
      console.error("Erro durante o login:", err);
      throw err;
    }
  }

  // ---------------- VERIFY TOKEN ----------------
  async verifyToken(): Promise<boolean> {
    try {
      // FIX: GET /api/user
      const response =
        await api.get<VerifyTokenResponse>("/user");

      return response.data.status === true;
    } catch (err) {
      console.error("Erro ao verificar o token:", err);
      return false;
    }
  }

  // ---------------- LOGOUT ----------------
  async logout(): Promise<void> {
    try {
      // FIX: DELETE /api/user
      await api.delete("/user");

      localStorage.removeItem("role");
      localStorage.removeItem("user");
    } catch (err: any) {
      console.error("Erro durante o logout:", err);
      throw err;
    }
  }
}