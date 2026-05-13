import { VerificarCodigoUseCase } from "@/app/use-case/agendamento/email-verify-code-agendamento-use-case";

export class VerificarCodigoController {
  async handle(email: string, codigo: string, agendamento: any) {

    const useCaseCode = new VerificarCodigoUseCase();

    const result = await useCaseCode.execute({
      email,
      codigo,
      agendamento,
    });


    return result;
  }
}