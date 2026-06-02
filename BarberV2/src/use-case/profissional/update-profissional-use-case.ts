// UPDATE

import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaProfessionalRepository } from "../../db/prisma/respositories/prisma-profissional-repository";
import { CreateLog } from "../logs/create-log";
import { IUpdateProfessional } from "../../../../../KingsBarberShopBackend/src/interface/profissional/update-profissional-interface";

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