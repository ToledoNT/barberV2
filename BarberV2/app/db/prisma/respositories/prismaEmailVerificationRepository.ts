import { prisma } from "../prisma-connection";
import { ResponseTemplateModel } from "../../../../../../KingsBarberShopBackend/src/model/response-templete-model";
import { ResponseTemplateInterface } from "../../../../../../KingsBarberShopBackend/src/interface/response-template-interface";

interface ICreateEmailVerification {
  email: string;
  nome: string;
  code: string;
  expiresAt: Date;
  attempts: number;
}

export class PrismaEmailVerificationRepository {

  async create(
    data: ICreateEmailVerification
  ): Promise<ResponseTemplateInterface> {
    try {
      const verification = await prisma.emailVerification.create({
        data: {
          email: data.email,
          nome: data.nome,
          code: data.code,
          expiresAt: data.expiresAt,
          attempts: data.attempts,
        },
      });

      return new ResponseTemplateModel(
        true,
        201,
        "Código de verificação criado com sucesso",
        verification
      );
    } catch (error: any) {
      console.error("Erro ao criar verificação de email:", error);

      return new ResponseTemplateModel(
        false,
        500,
        "Erro interno ao criar código de verificação",
        []
      );
    }
  }

async findByEmail(email: string) {
  try {
    return await prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { criadoEm: "desc" }, // corrigido aqui
    });
  } catch (error) {
    console.error("Erro ao buscar verificação:", error);
    return null;
  }
}

async incrementAttempts(email: string) {
  const verification = await prisma.emailVerification.findFirst({
    where: { email },
    orderBy: { criadoEm: "desc" },
  });

  if (!verification) {
    throw new Error("Verification not found");
  }

  const updated = await prisma.emailVerification.update({
    where: { id: verification.id },
    data: {
      attempts: {
        increment: 1,
      },
    },
  });

  return updated;
}

  async deleteByEmail(email: string) {
  try {
    const deleted = await prisma.emailVerification.deleteMany({
      where: { email },
    });

    return {
      status: true,
      message: "Código removido com sucesso",
      data: deleted,
      code: 200,
    };
  } catch (error) {
    console.error("Erro ao deletar verificação:", error);

    return {
      status: false,
      message: "Erro ao remover código",
      data: null,
      code: 500,
    };
  }
}
}