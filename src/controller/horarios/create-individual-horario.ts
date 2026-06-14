import { ICreateHorario } from "@/interface/horario/create-horario-interface";
import { CreateHorarioUseCase } from "@/use-case/horario/create-horario-use-case";

export class CreateHorarioIndividualController {
  async handle(body: any) {
    try {
      const {
        profissional,
        data,
        inicio,
        fim,
        disponivel,
      } = body;

      if (!profissional?.id) {
        return {
          status: false,
          code: 400,
          message:
            "O campo 'profissional.id' é obrigatório.",
          data: null,
        };
      }

      const horario: ICreateHorario = {
        profissionalId: profissional.id,
        data: new Date(data),
        inicio,
        fim,
        disponivel: disponivel ?? true,
      };

      const useCase =
        new CreateHorarioUseCase();

      const result =
        await useCase.execute(horario);

      return {
        status: true,
        code: 201,
        message:
          "Horário individual criado com sucesso.",
        data: result,
      };

    } catch (error: any) {
      console.error(
        "Erro ao criar horário individual:",
        error
      );

      return {
        status: false,
        code: 500,
        message:
          error.message ||
          "Erro ao criar horário individual.",
        data: null,
      };
    }
  }
}