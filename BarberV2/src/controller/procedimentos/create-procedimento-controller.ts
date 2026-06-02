import { ICreateProcedimento } from "../../../../../KingsBarberShopBackend/src/interface/procedimento/create-procedimento-interface";
import { CreateProcedimentoUseCase } from "../../use-case/procedimento/create-procedimento-use-case.";

export class CreateProcedimentoController {
  async handle(data: ICreateProcedimento) {
    const { nome, valor, profissionalId } = data;

    if (!nome || valor === undefined) {
      return {
        status: false,
        code: 400,
        message: "Nome e preço são obrigatórios.",
        data: [],
      };
    }

    const payload: ICreateProcedimento = {
      nome,
      valor,
      profissionalId,
    };

    const createdProcedimentoResult =
      await new CreateProcedimentoUseCase().execute(
        payload
      );

    return createdProcedimentoResult;
  }
}