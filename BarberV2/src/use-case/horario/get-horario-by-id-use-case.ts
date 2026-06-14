import { ResponseTemplateInterface } from "@/interface/response-template-interface";
import { PrismaHorarioRepository } from "../../db/prisma/respositories/prisma-horario-repository";
import { CreateLog } from "../logs/create-log";

export class GetHorarioByIdUseCase {
  async execute(id: string): Promise<ResponseTemplateInterface> {
    const horario = await new PrismaHorarioRepository().findById(id);

    if (!horario) {
      const response: ResponseTemplateInterface = {
        status: false,
        code: 404, 
        message: "Horário não encontrado",
        data: null,
      };
      await new CreateLog().execute(response);
      return response;
    }

    const response: ResponseTemplateInterface = {
      status: true,
      code: 200,
      message: "Horário encontrado",
      data: horario,
    };

    return response;
  }
}
