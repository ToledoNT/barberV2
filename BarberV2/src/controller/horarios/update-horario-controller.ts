import { IUpdateHorario } from "@/interface/horario/update-horario";
import { UpdateHorarioUseCase } from "@/use-case/horario/update-horario-use-case";

export class UpdateHorarioController {
  async handle(body: any) {
    const {
      id,
      profissionalId,
      data,
      inicio,
      fim,
      disponivel,
    } = body;

    if (!id) {
      return {
        status: false,
        code: 400,
        message:
          "O campo 'id' é obrigatório para atualização do horário.",
        data: [],
      };
    }

    const payload: IUpdateHorario = {
      id,
      ...(profissionalId && {
        profissionalId,
      }),
      ...(data && {
        data: new Date(data),
      }),
      ...(inicio && { inicio }),
      ...(fim && { fim }),
      ...(disponivel !== undefined && {
        disponivel: !!disponivel,
      }),
    };

    const updatedHorarioResult =
      await new UpdateHorarioUseCase().execute(
        id,
        payload
      );

    return updatedHorarioResult;
  }
}