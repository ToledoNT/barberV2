import { PrismaProfessionalRepository } from "@/src/db/prisma/respositories/prisma-profissional-repository";
import { GetAllProfessionalsUseCase } from "../../use-case/profissional/get-all-profissional-use-case";

export class GetAllProfessionalsController {
  async handle() {
    try {
      const repository = new PrismaProfessionalRepository();

      const useCase =
        new GetAllProfessionalsUseCase(repository);

      return await useCase.execute();

    } catch (error) {
      console.error(
        "Erro no controller (get profissionais):",
        error
      );

      return {
        status: false,
        message: "Erro ao buscar profissionais",
        data: [],
        code: 500,
      };
    }
  }
}