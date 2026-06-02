import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaAppointmentRepository } from "../../db/prisma/respositories/prisma-agendamento-repository";
import { CreateLog } from "../logs/create-log";
import { ICreateAppointment } from "@/app/interfaces/agendamentos/create-agendamento-interface";

export class CreateAppointmentUseCase {
  async execute(appointment: ICreateAppointment): Promise<ResponseTemplateInterface> {
    const responseCreate = await new PrismaAppointmentRepository().create(appointment);

    if (!responseCreate.status) {
      await new CreateLog().execute(responseCreate);
    }

    return responseCreate;
  }
}