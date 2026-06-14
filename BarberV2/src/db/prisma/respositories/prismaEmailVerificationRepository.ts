import { ResponseTemplateInterface } from "@/interface/response-template-interface";
import { prisma } from "../prisma-connection";

import { ICreateEmailVerification } from "@/interface/email/create-email-verifycation";
import { ResponseTemplateModel } from "@/model/response-templete-model";

export class PrismaEmailVerificationRepository {

  async create(data: ICreateEmailVerification): Promise<ResponseTemplateInterface> {
    try {
      const verification = await prisma.preScheduling.create({
        data: {
          email: data.email,
          nome: data.nome,
          code: data.code,
          expiresAt: data.expiresAt,
          attempts: data.attempts ?? 0,
          tipo: data.tipo,
          payload: data.payload ?? {},
        },
      });

      return new ResponseTemplateModel(
        true,
        201,
        "Código criado com sucesso",
        verification
      );
    } catch (error: any) {
      console.error("Erro ao criar verificação:", error);

      return new ResponseTemplateModel(false, 500, "Erro interno", []);
    }
  }
async findLastByEmail(email: string) {
  try {
    return await prisma.preScheduling.findFirst({
      where: { email },
      orderBy: { criadoEm: "desc" },
    });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return null;
  }
}
  async update(id: string, data: Partial<ICreateEmailVerification>) {
    try {
      const updated = await prisma.preScheduling.update({
        where: { id },
        data: {
          ...(data.email && { email: data.email }),
          ...(data.nome && { nome: data.nome }),
          ...(data.code && { code: data.code }),
          ...(data.expiresAt && { expiresAt: data.expiresAt }),
          ...(data.attempts !== undefined && { attempts: data.attempts }),
          ...(data.tipo && { tipo: data.tipo }),
          ...(data.payload && { payload: data.payload }),
        },
      });

      return new ResponseTemplateModel(
        true,
        200,
        "Código atualizado com sucesso",
        updated
      );
    } catch (error) {
      console.error("Erro ao atualizar:", error);

      return new ResponseTemplateModel(false, 500, "Erro ao atualizar", []);
    }
  }

  async incrementAttempts(email: string) {
    try {
      const verification = await prisma.preScheduling.findFirst({
        where: { email },
        orderBy: { criadoEm: "desc" },
      });

      if (!verification) throw new Error("Not found");

      return await prisma.preScheduling.update({
        where: { id: verification.id },
        data: {
          attempts: { increment: 1 },
        },
      });
    } catch (error) {
      console.error("Erro increment attempts:", error);
      throw error;
    }
  }

  async deleteByEmail(email: string) {
    try {
      const deleted = await prisma.preScheduling.deleteMany({
        where: { email },
      });

      return {
        status: true,
        message: "Removido com sucesso",
        data: deleted,
        code: 200,
      };
    } catch (error) {
      console.error("Erro ao deletar:", error);

      return {
        status: false,
        message: "Erro ao remover",
        data: null,
        code: 500,
      };
    }
  }
}