import { VerificarCodigoUseCase } from "@/app/use-case/agendamento/email-verify-code-agendamento-use-case";

export class VerificarCodigoController {
  async handle(email: string, codigo: string, agendamento: any) {
    console.log("📩 ===== VERIFICAR CÓDIGO REQUEST =====");
    console.log("📧 Email:", email);
    console.log("🔐 Código:", codigo);
    console.log("📦 Agendamento COMPLETO:", JSON.stringify(agendamento, null, 2));
    console.log("📊 Tipo do agendamento:", typeof agendamento);
    console.log("📊 Keys:", agendamento ? Object.keys(agendamento) : null);
    console.log("=====================================");

    const useCaseCode = new VerificarCodigoUseCase();

    const result = await useCaseCode.execute({
      email,
      codigo,
      agendamento,
    });

    console.log("✅ ===== RESPONSE USECASE =====");
    console.log(result);
    console.log("==============================");

    return result;
  }
}