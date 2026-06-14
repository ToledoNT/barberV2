import { Resend } from "resend";

export class ResendEmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("RESEND_API_KEY não configurada no .env");
    }

    this.resend = new Resend(apiKey);
  }

  async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      const response = await this.resend.emails.send({
        from: params.from || "onboarding@resend.dev",
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      return {
        status: true,
        code: 200,
        message: "Email enviado com sucesso",
        data: response,
      };
    } catch (error: any) {
      console.error("Erro ao enviar email:", error);

      return {
        status: false,
        code: 500,
        message: "Erro ao enviar email",
        error: error?.message,
        data: null,
      };
    }
  }
}