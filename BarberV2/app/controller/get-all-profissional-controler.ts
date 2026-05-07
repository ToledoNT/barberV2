import { PrismaProfessionalRepository } from "../db/prisma/respositories/prisma-profissional-repository";
import { GetAllProfessionalsUseCase } from "../use-case/get-all-profissional-use-case";

export class GetAllProfessionalsController {
  async handle() {
    const repository = new PrismaProfessionalRepository();
    const useCase = new GetAllProfessionalsUseCase(repository);

    return await useCase.execute();
  }
}