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

//   async getByEmail(email: string): Promise<ResponseTemplateInterface> {
//     try {
//       const verification = await prisma.emailVerification.findFirst({
//         where: { email },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });

//       if (!verification) {
//         return new ResponseTemplateModel(
//           false,
//           404,
//           "Código não encontrado",
//           []
//         );
//       }

//       return new ResponseTemplateModel(
//         true,
//         200,
//         "Código encontrado com sucesso",
//         verification
//       );
//     } catch (error: any) {
//       console.error("Erro ao buscar código de verificação:", error);

//       return new ResponseTemplateModel(
//         false,
//         500,
//         "Erro interno ao buscar código",
//         []
//       );
//     }
  //}
}