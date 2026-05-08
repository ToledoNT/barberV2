import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { ICreateProcedimento } from "../../../../../KingsBarberShopBackend/src/interface/procedimento/create-procedimento-interface";
import { PrismaProcedimentoRepository } from "../../db/prisma/respositories/prisma-procedimento-repository";
import { CreateLog } from "../logs/create-log";

export class CreateProcedimentoUseCase {
  async execute(procedimento: ICreateProcedimento): Promise<ResponseTemplateInterface> {
    const responseCreate = await new PrismaProcedimentoRepository().create(procedimento);

    if (!responseCreate.status) {
      await new CreateLog().execute(responseCreate);
    }

    return responseCreate;
  }
}