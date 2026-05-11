import bcrypt from "bcrypt";
import { PrismaEmailVerificationRepository } from "@/app/db/prisma/respositories/prismaEmailVerificationRepository";

interface IRequest {
  email: string;
  codigo: string;
  agendamento: any;
}

export class VerificarCodigoUseCase {
  async execute({ email, codigo, agendamento }: IRequest) {
    const repository = new PrismaEmailVerificationRepository();

    const verification = await repository.findByEmail(email);

    if (!verification) {
      return {
        status: false,
        message: "Código não encontrado",
        code: 404,
      };
    }

    // ⏱️ EXPIRAÇÃO (5 minutos)
    if (new Date() > verification.expiresAt) {
      await repository.deleteByEmail(email);

      return {
        status: false,
        message: "Código expirado",
        code: 400,
      };
    }

    // 🔐 VALIDAÇÃO DO CÓDIGO
    const isValid = await bcrypt.compare(codigo, verification.code);

    if (!isValid) {
      const updated = await repository.incrementAttempts(email);

      // 🚨 bloqueia após 5 tentativas
      if (updated.attempts >= 5) {
        await repository.deleteByEmail(email);

        return {
          status: false,
          message: "Código bloqueado após muitas tentativas",
          code: 429,
        };
      }

      return {
        status: false,
        message: "Código inválido",
        code: 400,
      };
    }
    
    await repository.deleteByEmail(email);

    return {
      status: true,
      message: "Código validado com sucesso",
      code: 200,
      data: {
        email,
        agendamento,
      },
    };
  }
}