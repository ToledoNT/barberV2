import { IUpdateHorario } from "@/app/interfaces/horario/update-horario";
import { PrismaHorarioRepository } from "../../db/prisma/respositories/prisma-horario-repository";
import { CreateLog } from "../logs/create-log";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

export class UpdateHorarioUseCase {
  async execute(id: string, horario: IUpdateHorario): Promise<ResponseTemplateInterface> {
    const responseUpdate = await new PrismaHorarioRepository().update(id, horario);

    if (!responseUpdate.status) {
      await new CreateLog().execute(responseUpdate);
    }

    return responseUpdate;
  }
}