import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaHorarioRepository } from "../../db/prisma/respositories/prisma-horario-repository";
import { CreateLog } from "../logs/create-log";

export class GetHorariosByBarbeiroUseCase {
  async execute(barbeiroId: string): Promise<ResponseTemplateInterface> {
    const response = await new PrismaHorarioRepository().getByBarbeiro(barbeiroId);

    if (!response.status) {
      await new CreateLog().execute(response);
    }

    return response;
  }
}