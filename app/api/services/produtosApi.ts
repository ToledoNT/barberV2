import axios from "axios";
import { ResponseTemplateInterface } from "app/interfaces/response-templete-interface";
import { IProduto } from "app/interfaces/produtosInterface";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export class ProductService {
  async fetchProdutos(): Promise<IProduto[]> {
    try {
      const response = await api.get<
        ResponseTemplateInterface<IProduto[]>
      >("/produtos");

      if (!response.data.status || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      return [];
    }
  }

  async fetchProdutoById(
    id: string
  ): Promise<IProduto | null> {
    try {
      const response = await api.get<
        ResponseTemplateInterface<IProduto>
      >(`/produtos?id=${id}`);

      if (!response.data.status || !response.data.data) {
        return null;
      }

      return response.data.data;
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      return null;
    }
  }

  async createProduto(
    data: Partial<IProduto>
  ): Promise<IProduto> {
    try {
      const response = await api.post<
        ResponseTemplateInterface<IProduto>
      >("/produtos", data);

      if (!response.data.status || !response.data.data) {
        throw new Error(
          response.data.message || "Erro ao criar produto"
        );
      }

      return response.data.data;
    } catch (err: any) {
      console.error("Erro ao criar produto:", err);

      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Erro ao criar produto"
      );
    }
  }

  async updateProduto(
    id: string,
    data: Partial<IProduto>
  ): Promise<IProduto | null> {
    try {
      const response = await api.put<
        ResponseTemplateInterface<IProduto>
      >(`/produtos?id=${id}`, data);

      if (!response.data.status || !response.data.data) {
        throw new Error(
          response.data.message || "Erro ao atualizar produto"
        );
      }

      return response.data.data;
    } catch (err: any) {
      console.error("Erro ao atualizar produto:", err);

      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Erro ao atualizar produto"
      );
    }
  }

  async deleteProduto(id: string): Promise<void> {
    try {
      const response = await api.delete<
        ResponseTemplateInterface<null>
      >(`/produtos?id=${id}`);

      if (!response.data.status) {
        throw new Error(
          response.data.message || "Erro ao deletar produto"
        );
      }
    } catch (err: any) {
      console.error("Erro ao deletar produto:", err);

      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Erro ao deletar produto"
      );
    }
  }
}