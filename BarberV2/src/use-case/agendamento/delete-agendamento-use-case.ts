import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaAppointmentRepository } from "../../db/prisma/respositories/prisma-agendamento-repository";
import { CreateLog } from "../logs/create-log";

export class DeleteAppointmentUseCase {
  async execute(id: string): Promise<ResponseTemplateInterface> {
    const responseDelete = await new PrismaAppointmentRepository().deleteById(id);

    if (!responseDelete.status) {
      await new CreateLog().execute(responseDelete);
    }

    return responseDelete;
  }
}