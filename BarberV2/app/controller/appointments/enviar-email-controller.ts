import { EnviarCodigoUseCase } from "@/app/use-case/agendamento/email-verify-create-code-use-case";

export class EnviarCodigoController {
  async handle(email: string, nome: string) {
    try {
      if (!email) {
        return {
          status: false,
          message: "E-mail é obrigatório",
          data: null,
          code: 400,
        };
      }

      const useCase = new EnviarCodigoUseCase();

      const response = await useCase.execute(email, nome);

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