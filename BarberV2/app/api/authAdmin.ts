import axios from "axios";
import { LoginData, LoginResult } from "../interfaces/loginInterface";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export class AuthService {
  async login(data: LoginData): Promise<LoginResult> {
    try {
      const response = await api.post<{
        status: boolean;
        code?: number;
        message?: string;
        data: {
          user: LoginResult;
          token: string;
        };
      }>("/user", data);

      if (!response.data.status || !response.data.data) {
        throw new Error(response.data.message || "Erro ao realizar login");
      }

      const { user } = response.data.data;

      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (err) {
      console.error("Erro durante o login:", err);
      throw err;
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      const response = await api.get("/user");

      return response.data.status === true;
    } catch (err) {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.delete("/user");

      localStorage.removeItem("role");
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Erro logout:", err);
      throw err;
    }
  }
}