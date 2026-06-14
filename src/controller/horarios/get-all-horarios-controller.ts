import { GetAllHorariosUseCase } from "@/use-case/horario/get-all-horario-use-case";

export class GetAllHorariosController {
  async handle() {
    try {
      const result =
        await new GetAllHorariosUseCase().execute();

      return result;

    } catch (error) {
      console.error(
        "Erro no controller (get horários):",
        error
      );

      return {
        status: false,
        code: 500,
        message: "Erro ao buscar horários.",
        data: [],
      };
    }
  }
}