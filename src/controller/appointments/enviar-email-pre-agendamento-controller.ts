import { EnviarPreAgendamentoUseCase } from "../../use-case/agendamento/pre-agendamento-generate-code";
import { SendEmailUseCase } from "../../use-case/resend/send-email-code";

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

      const preAgendamentoUseCase =
        new EnviarPreAgendamentoUseCase();

      const response =
        await preAgendamentoUseCase.execute(
          email,
          nome,
          agendamento
        );

      if (!response?.status) {
        return response;
      }

      const codigo = response.data?.codigo;

      if (!codigo) {
        return {
          status: false,
          message: "Código de confirmação não gerado",
          data: null,
          code: 500,
        };
      }

      const sendEmailUseCase =
        new SendEmailUseCase();

      try {
        await sendEmailUseCase.execute({
          from: "Agendamento <onboarding@resend.dev>",
          to: email,
          subject: "Código de confirmação do agendamento",
          html: `
            <div style="
              font-family: Arial, Helvetica, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              overflow: hidden;
              color: #333;
            ">

              <div style="
                background: #111827;
                padding: 24px;
                text-align: center;
              ">
                <h1 style="
                  color: #ffffff;
                  margin: 0;
                  font-size: 24px;
                ">
                  ✂️ Confirmação de Agendamento
                </h1>
              </div>


              <div style="padding: 32px;">

                <h2 style="
                  color: #111827;
                  margin-bottom: 16px;
                ">
                  Olá, ${nome}! 👋
                </h2>


                <p style="
                  font-size: 16px;
                  color: #4b5563;
                  line-height: 1.6;
                ">
                  Para confirmar seu e-mail e continuar
                  com o agendamento, utilize o código abaixo:
                </p>


                <div style="
                  text-align: center;
                  margin: 32px 0;
                ">
                  <div style="
                    display: inline-block;
                    background: #f9fafb;
                    border: 2px dashed #111827;
                    border-radius: 12px;
                    padding: 20px 32px;
                  ">
                    <span style="
                      font-size: 36px;
                      font-weight: bold;
                      letter-spacing: 8px;
                      color: #111827;
                    ">
                      ${codigo}
                    </span>
                  </div>
                </div>


                <p style="
                  font-size: 14px;
                  color: #6b7280;
                  text-align: center;
                ">
                  Esse código é válido por 5 minutos.
                </p>


                <hr style="
                  border: none;
                  border-top: 1px solid #e5e7eb;
                  margin: 32px 0;
                ">


                <p style="
                  font-size: 14px;
                  color: #6b7280;
                  line-height: 1.5;
                ">
                  Se você não solicitou este código,
                  ignore este e-mail.
                </p>


                <p style="
                  margin-top: 32px;
                  font-size: 14px;
                  color: #374151;
                ">
                  Atenciosamente,<br/>
                  <strong>Equipe de Agendamentos</strong>
                </p>

              </div>


              <div style="
                background: #f9fafb;
                padding: 16px;
                text-align: center;
                font-size: 12px;
                color: #9ca3af;
              ">
                Este é um e-mail automático.
              </div>

            </div>
          `,
        });
      } catch (emailError) {
        console.error(
          "Erro ao enviar e-mail de confirmação:",
          emailError
        );

        return {
          status: false,
          message: "Código gerado, mas falha ao enviar e-mail",
          data: null,
          code: 500,
        };
      }


      return {
        ...response,
        message: "Código enviado com sucesso",
      };

    } catch (error) {
      console.error(
        "EnviarCodigoController error:",
        error
      );

      return {
        status: false,
        message: "Erro interno ao enviar código",
        data: null,
        code: 500,
      };
    }
  }
}