import { DeleteAppointmentUseCase } from "../../use-case/agendamento/delete-agendamento-use-case";

export class DeleteAppointmentController {
  async handle(id: string) {
    if (!id) {
      return {
        status: false,
        code: 400,
        message:
          "O parâmetro 'id' é obrigatório para deletar o agendamento.",
        data: [],
      };
    }

    const result =
      await new DeleteAppointmentUseCase().execute(
        id
      );

    return result;
  }
}