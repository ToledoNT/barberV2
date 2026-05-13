import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaAppointmentRepository } from "../../db/prisma/respositories/prisma-agendamento-repository";
import { CreateLog } from "../logs/create-log";

export class GetAllAppointmentsUseCase {
  async execute(): Promise<ResponseTemplateInterface> {
    const response = await new PrismaAppointmentRepository().getAll();

    if (!response.status) {
      await new CreateLog().execute(response);
    }

    return response;
  }
}