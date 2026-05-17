import { EnviarPreAgendamentoUseCase } from "@/app/use-case/agendamento/pre-agendamento-generate-code";
import { SendEmailUseCase } from "@/app/use-case/resend/send-email-code";

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

      if (!response.status) {
        return response;
      }

      const codigo = response.data?.codigo;

      const sendEmailUseCase = new SendEmailUseCase();

      await sendEmailUseCase.execute({
        from: "Agendamento <onboarding@resend.dev>",
        to: email,
        subject: "Código de Confirmação",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Olá, ${nome}</h2>

            <p>Por favor, confirme o código abaixo:</p>

            <div
              style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 6px;
                background: #f4f4f4;
                padding: 15px;
                border-radius: 8px;
                width: fit-content;
                margin: 20px 0;
              "
            >
              ${codigo}
            </div>

            <p>Se você não solicitou este código, ignore este e-mail.</p>
          </div>
        `,
      });

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