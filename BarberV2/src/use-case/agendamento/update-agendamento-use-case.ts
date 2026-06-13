import { IUpdateAppointment } from "@/app/interfaces/agendamentos/update-agendamento-interface";
import { PrismaAppointmentRepository } from "../../db/prisma/respositories/prisma-agendamento-repository";
import { CreateLog } from "../logs/create-log";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";

export class UpdateAppointmentUseCase {
  async execute(data: IUpdateAppointment): Promise<ResponseTemplateInterface> {
    const responseUpdate = await new PrismaAppointmentRepository().update(data);

    if (!responseUpdate.status) {
      await new CreateLog().execute(responseUpdate);
    }

    return responseUpdate;
  }
}