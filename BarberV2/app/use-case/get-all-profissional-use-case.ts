import { ResponseTemplateInterface } from "../interfaces/response-templete-interface";

/**
 * REPOSITORY DE PROFISSIONAIS
 */
export interface ProfessionalRepository {
  getAll(): Promise<ResponseTemplateInterface>;
}

/**
 * USE CASE: GET ALL PROFISSIONAIS
 */
export class GetAllProfessionalsUseCase {
  constructor(private repository: ProfessionalRepository) {}

  async execute(): Promise<ResponseTemplateInterface> {
    try {
      const response = await this.repository.getAll();

      if (!response.status) {
        console.warn("Falha ao buscar profissionais:", response.message);
      }

      return response;
    } catch (error) {
      console.error("Erro no use case (profissionais):", error);

      return {
        status: false,
        message: "Erro ao buscar profissionais",
        data: [],
        code: 500,
      };
    }
  }
}