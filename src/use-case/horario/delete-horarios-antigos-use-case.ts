import { PrismaHorarioRepository } from "@/db/prisma/respositories/prisma-horario-repository";
import { ResponseTemplateInterface } from "@/interface/response-template-interface";
import { CreateLog } from "../logs/create-log";

export class DeleteAllHorariosUseCase {
  async execute(): Promise<ResponseTemplateInterface> {
    const responseDelete =
      await new PrismaHorarioRepository().deleteManyOld();

    if (!responseDelete.status) {
      await new CreateLog().execute(responseDelete);
    }

    return responseDelete;
  }
}