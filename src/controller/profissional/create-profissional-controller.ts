import { ICreateProfessional } from "@/interface/profissional/create-profissional";
import { CreateProfessionalModel } from "@/model/profissional/create-profissional-model";
import { CreateProfissionalUseCase } from "@/use-case/profissional/create-profissional-use-case";

export class CreateProfessionalController {
  async handle(body: any) {
    const { nome, email, telefone, procedimentos } = body;

    if (!nome || !email || !telefone) {
      return {
        status: false,
        code: 400,
        message:
          "Os campos 'nome', 'email' e 'telefone' são obrigatórios.",
        data: [],
      };
    }

    const payload: ICreateProfessional =
      new CreateProfessionalModel({
        nome,
        email,
        telefone,
        procedimentos,
      }).toPayload();

    const useCase = new CreateProfissionalUseCase();

    const createdProfessionalResult =
      await useCase.execute(payload);

    if (
      createdProfessionalResult.status &&
      createdProfessionalResult.data
    ) {
      const {
        id,
        nome,
        email,
        telefone,
        criadoEm,
        atualizadoEm,
      } = createdProfessionalResult.data;

      createdProfessionalResult.data = {
        id,
        name: nome,
        email,
        telefone,
        createdAt: criadoEm,
        updatedAt: atualizadoEm,
      };
    }

    return createdProfessionalResult;
  }
}