import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaProcedimentoRepository } from "../../db/prisma/respositories/prisma-procedimento-repository";
import { CreateLog } from "../logs/create-log";

export class DeleteProcedimentoUseCase {
  async execute(id: string): Promise<ResponseTemplateInterface> {
    const responseDelete = await new PrismaProcedimentoRepository().delete(id);

    if (!responseDelete.status) {
      await new CreateLog().execute(responseDelete);
    }

    return responseDelete;
  }
}