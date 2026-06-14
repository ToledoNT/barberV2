import { ResponseTemplateInterface } from "app/interfaces/response-templete-interface";
import { PrismaProfessionalRepository } from "../../db/prisma/respositories/prisma-profissional-repository";
import { CreateLog } from "../logs/create-log"; 

export class GetBarbeiroByIdUseCase {
  async execute(barbeiroId: string): Promise<ResponseTemplateInterface> {
    const response = await new PrismaProfessionalRepository().getById(barbeiroId);

    if (!response.status) {
      await new CreateLog().execute(response);
    }

    return response;
  }
}