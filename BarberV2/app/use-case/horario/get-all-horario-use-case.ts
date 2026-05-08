import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaHorarioRepository } from "../../db/prisma/respositories/prisma-horario-repository";
import { CreateLog } from "../logs/create-log";

export class GetAllHorariosUseCase {
  async execute(): Promise<ResponseTemplateInterface> {
    const response = await new PrismaHorarioRepository().getAll();

    if (!response.status) {
      await new CreateLog().execute(response);
    }

    return response;
  }
}