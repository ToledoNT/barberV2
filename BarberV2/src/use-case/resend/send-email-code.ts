import { ResponseTemplateInterface } from "@/interface/response-template-interface";
import { ResendEmailService } from "app/api/services/resendEmail";
import { CreateLog } from "../logs/create-log";

interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class SendEmailUseCase {
  async execute({
    to,
    subject,
    html,
    from,
  }: SendEmailRequest): Promise<ResponseTemplateInterface> {
    const emailService = new ResendEmailService();

    const response = await emailService.sendEmail({
      to,
      subject,
      html,
      from,
    });

    if (!response.status) {
      await new CreateLog().execute(response);
    }

    return response;
  }
}