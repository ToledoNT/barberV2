import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaProcedimentoRepository } from "../../db/prisma/respositories/prisma-procedimento-repository";
import { CreateLog } from "../logs/create-log";
import { IUpdateProcedimento } from "../../../../../KingsBarberShopBackend/src/interface/procedimento/update-procedimento-interface";

export class UpdateProcedimentoUseCase {
  async execute(id: string, procedimento: IUpdateProcedimento): Promise<ResponseTemplateInterface> {
    const responseUpdate = await new PrismaProcedimentoRepository().update(id, procedimento);

    if (!responseUpdate.status) {
      await new CreateLog().execute(responseUpdate);
    }

    return responseUpdate;
  }
}