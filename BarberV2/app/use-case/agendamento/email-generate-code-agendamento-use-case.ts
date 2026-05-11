import bcrypt from "bcrypt";
import { randomInt } from "crypto";
import { CreateLog } from "../logs/create-log";
import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaEmailVerificationRepository } from "@/app/db/prisma/respositories/prismaEmailVerificationRepository";

export class EnviarCodigoUseCase {
  async execute(email: string, nome: string): Promise<ResponseTemplateInterface> {
    const codigo = randomInt(100000, 999999).toString();

    const hashedCode = await bcrypt.hash(codigo, 10);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const responseCreate = await new PrismaEmailVerificationRepository().create({
      email,
      nome,
      code: hashedCode,
      expiresAt,
      attempts: 0,
    });

    if (!responseCreate.status) {
      await new CreateLog().execute(responseCreate);
    }

    return {
      status: responseCreate.status,
      message: responseCreate.message,
      data: {
        email,
        nome,
      },
      code: responseCreate.code,
    };
  }
}