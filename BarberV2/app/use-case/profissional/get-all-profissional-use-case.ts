import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { CreateLog } from "../logs/create-log";

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
      const responseGetAll = await this.repository.getAll();

      if (!responseGetAll.status) {
        console.warn(
          "Falha ao buscar profissionais:",
          responseGetAll.message
        );

        await new CreateLog().execute(responseGetAll);
      }

      return responseGetAll;

    } catch (error) {
      console.error("Erro no use case (profissionais):", error);

      const errorResponse: ResponseTemplateInterface = {
        status: false,
        message: "Erro ao buscar profissionais",
        data: [],
        code: 500,
      };

      await new CreateLog().execute(errorResponse);

      return errorResponse;
    }
  }
}