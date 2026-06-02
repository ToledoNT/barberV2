import bcrypt from "bcrypt";
import { PrismaEmailVerificationRepository } from "../../db/prisma/respositories/prismaEmailVerificationRepository";

interface IRequest {
  email: string;
  codigo: string;
}

export class VerificarCodigoUseCase {
  async execute({ email, codigo }: IRequest) {
    const repository = new PrismaEmailVerificationRepository();

    const verification = await repository.findLastByEmail(email);

    if (!verification) {
      return {
        status: false,
        message: "Código não encontrado",
        code: 404,
      };
    }

    if (new Date() > verification.expiresAt) {
      await repository.deleteByEmail(email);

      return {
        status: false,
        message: "Código expirado",
        code: 400,
      };
    }

    const isValid = await bcrypt.compare(codigo, verification.code);

    if (!isValid) {
      const updated = await repository.incrementAttempts(email);

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

return {
  status: true,
  message: "Código validado com sucesso",
  code: 200,
  data: {
    email,
    payload: verification.payload,
  },
};
  }
}