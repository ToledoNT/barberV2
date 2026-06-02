// CREATE

import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaProfessionalRepository } from "../../db/prisma/respositories/prisma-profissional-repository";
import { CreateLog } from "../logs/create-log";
import { ICreateProfessional } from "../../../../../KingsBarberShopBackend/src/interface/profissional/create-profissional";

export class CreateProfissionalUseCase {
  async execute(
    professional: ICreateProfessional
  ): Promise<ResponseTemplateInterface> {
    try {
      const responseCreate =
        await new PrismaProfessionalRepository().create(professional);

      if (!responseCreate.status) {
        console.warn(
          "Falha ao criar profissional:",
          responseCreate.message
        );

        try {
          await new CreateLog().execute(responseCreate);
        } catch (logError) {
          console.error("Erro ao salvar log:", logError);
        }
      }

      return responseCreate;

    } catch (error) {
      console.error("Erro no use case (create profissional):", error);

      const errorResponse: ResponseTemplateInterface = {
        status: false,
        message: "Erro ao criar profissional",
        data: [],
        code: 500,
      };

      try {
        await new CreateLog().execute(errorResponse);
      } catch (logError) {
        console.error("Erro ao salvar log:", logError);
      }

      return errorResponse;
    }
  }
}