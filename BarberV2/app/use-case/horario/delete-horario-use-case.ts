import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaHorarioRepository } from "../../db/prisma/respositories/prisma-horario-repository";
import { CreateLog } from "../logs/create-log";

export class DeleteHorarioUseCase {
  async execute(id: string): Promise<ResponseTemplateInterface> {
    const responseDelete = await new PrismaHorarioRepository().delete(id);

    if (!responseDelete.status) {
      await new CreateLog().execute(responseDelete);
    }

    return responseDelete;
  }
}