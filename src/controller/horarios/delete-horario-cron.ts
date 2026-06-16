import { ResponseTemplateInterface } from "@/interface/response-template-interface";
import { DeleteHorarioUseCase } from "@/use-case/horario/delete-horario-use-case";
import { GetAllHorariosUseCase } from "@/use-case/horario/get-all-horario-use-case";

export class DeleteOldTimesController {
  async handle(): Promise<ResponseTemplateInterface> {
    try {
      const horariosResponse =
        await new GetAllHorariosUseCase().execute();

      if (!horariosResponse.status) {
        return horariosResponse;
      }

      const horarios =
        horariosResponse.data || [];

      const hoje = new Date()
        .toISOString()
        .split("T")[0];

      let deletados = 0;

      for (const horario of horarios) {
        if (!horario.data) continue;

        const dataHorario = String(horario.data).split("T")[0];

        if (dataHorario < hoje) {
          const responseDelete =
            await new DeleteHorarioUseCase().execute(
              horario.id
            );

          if (responseDelete.status) {
            deletados++;
          }
        }
      }

      return {
        status: true,
        code: 200,
        message: `${deletados} horários antigos removidos com sucesso`,
        data: { deletados },
      };
    } catch (error) {
      console.error(error);

      return {
        status: false,
        code: 500,
        message: "Erro ao remover horários antigos",
        data: [],
      };
    }
  }
}