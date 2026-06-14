// UPDATE

import { PrismaProfessionalRepository } from "@/db/prisma/respositories/prisma-profissional-repository";
import { IUpdateProfessional } from "@/interface/profissional/update-profissional-interface";
import { ResponseTemplateInterface } from "@/interface/response-template-interface";
import { CreateLog } from "../logs/create-log";

export class UpdateProfissionalUseCase {
  async execute(
    data: IUpdateProfessional
  ): Promise<ResponseTemplateInterface> {
    try {
      const responseUpdate =
        await new PrismaProfessionalRepository().update(data);

      if (!responseUpdate.status) {
        console.warn(
          "Falha ao atualizar profissional:",
          responseUpdate.message
        );

        try {
          await new CreateLog().execute(responseUpdate);
        } catch (logError) {
          console.error("Erro ao salvar log:", logError);
        }
      }

      return responseUpdate;

    } catch (error) {
      console.error("Erro no use case (update profissional):", error);

      const errorResponse: ResponseTemplateInterface = {
        status: false,
        message: "Erro ao atualizar profissional",
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