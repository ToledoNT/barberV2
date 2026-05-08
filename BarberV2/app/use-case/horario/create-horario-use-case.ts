import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaHorarioRepository } from "../../db/prisma/respositories/prisma-horario-repository";
import { CreateLog } from "../logs/create-log";
import { ICreateHorario } from "@/app/interfaces/horario/create-horario-interface";

export class CreateHorarioUseCase {
  async execute(horario: ICreateHorario): Promise<ResponseTemplateInterface> {
    const responseCreate = await new PrismaHorarioRepository().create(horario);

    if (!responseCreate.status) {
      await new CreateLog().execute(responseCreate);
    }

    return responseCreate;
  }
}