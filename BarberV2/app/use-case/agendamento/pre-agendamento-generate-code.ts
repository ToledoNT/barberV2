import bcrypt from "bcrypt";
import { randomInt } from "crypto";

import { CreateLog } from "../logs/create-log";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaEmailVerificationRepository } from "@/app/db/prisma/respositories/prismaEmailVerificationRepository";

export class EnviarPreAgendamentoUseCase {
  async execute(
    email: string,
    nome: string,
    agendamento?: any
  ): Promise<ResponseTemplateInterface> {
    try {
      const repository = new PrismaEmailVerificationRepository();

      const codigo = randomInt(100000, 999999).toString();

      const hashedCode = await bcrypt.hash(codigo, 10);

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      const existing = await repository.findLastByEmail(email);

      let responseCreate;

      if (existing) {
        responseCreate = await repository.update(existing.id, {
          email,
          nome,
          code: hashedCode,
          expiresAt,
          attempts: 0,
          tipo: agendamento?.tipo ?? "normal",
          payload: agendamento ?? {},
        });
      } else {
        responseCreate = await repository.create({
          email,
          nome,
          code: hashedCode,
          expiresAt,
          attempts: 0,
          tipo: agendamento?.tipo ?? "normal",
          payload: agendamento ?? {},
        });
      }

      if (!responseCreate.status) {
        await new CreateLog().execute(responseCreate);
      }

      return {
        status: responseCreate.status,
        message: responseCreate.message,
        data: {
          email,
          nome,
          codigo, 
          expiresAt,
          tipo: agendamento?.tipo ?? "normal",
        },
        code: responseCreate.code,
      };
    } catch (error) {
      console.error("Erro no use case:", error);

      return {
        status: false,
        message: "Erro interno ao gerar pré-agendamento",
        data: null,
        code: 500,
      };
    }
  }
}