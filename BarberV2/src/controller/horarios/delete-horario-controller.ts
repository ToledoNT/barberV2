import { DeleteHorarioUseCase } from "@/use-case/horario/delete-horario-use-case";

export class DeleteHorarioController {
  async handle(id: string) {
    try {
      if (!id) {
        return {
          status: false,
          code: 400,
          message:
            "O parâmetro 'id' é obrigatório para deletar o horário.",
          data: [],
        };
      }

      const result =
        await new DeleteHorarioUseCase().execute(id);

      return result;

    } catch (error) {
      console.error(
        "Erro no controller (delete horário):",
        error
      );

      return {
        status: false,
        code: 500,
        message: "Erro ao deletar horário.",
        data: [],
      };
    }
  }
}