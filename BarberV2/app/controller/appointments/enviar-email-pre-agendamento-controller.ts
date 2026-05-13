import { EnviarPreAgendamentoUseCase } from "@/app/use-case/agendamento/pre-agendamento-generate-code";

export class EnviarCodigoController {
  async handle(
    email: string,
    nome: string,
    agendamento?: any
  ) {
    try {
      if (!email) {
        return {
          status: false,
          message: "E-mail é obrigatório",
          data: null,
          code: 400,
        };
      }

      const useCase = new EnviarPreAgendamentoUseCase();

      const response = await useCase.execute(
        email,
        nome,
        agendamento 
      );

      return response;
    } catch (error) {
      console.error("EnviarCodigoController error:", error);

      return {
        status: false,
        message: "Erro ao enviar código",
        data: null,
        code: 500,
      };
    }
  }
}