
import { ResponseTemplateInterface } from "@/interface/response-template-interface";
import { CreateLog } from "../logs/create-log";
import { PrismaProfessionalRepository } from "@/db/prisma/respositories/prisma-profissional-repository";

export class DeleteProfissionalUseCase {
  async execute(id: string): Promise<ResponseTemplateInterface> {
    try {
      const repository = new PrismaProfessionalRepository();

      const deleteResult = await repository.deleteById(id);

      if (!deleteResult.status) {
        console.warn(
          "Falha ao deletar profissional:",
          deleteResult.message
        );

        try {
          await new CreateLog().execute(deleteResult);
        } catch (logError) {
          console.error("Erro ao salvar log:", logError);
        }
      }

      return deleteResult;

    } catch (error) {
      console.error("Erro no use case (delete profissional):", error);

      const errorResponse: ResponseTemplateInterface = {
        status: false,
        message: "Erro ao deletar profissional",
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