import { UpdateProcedimentoUseCase } from "@/src/use-case/procedimento/update-procedimento-use-case";
import { IUpdateProcedimento } from "../../../../../KingsBarberShopBackend/src/interface/procedimento/update-procedimento-interface";
import { UpdateProcedimentoModel } from "@/src/model/procedimento/procedimento/update-procedimento-use-case";

export class UpdateProcedimentoController {
  async handle(data: {
    id: string;
    nome: string;
    valor: number;
    profissionalId?: string;
  }) {
    const { id, nome, valor, profissionalId } =
      data;

    if (!id || !nome || valor === undefined) {
      return {
        status: false,
        code: 400,
        message:
          "ID, nome e preço são obrigatórios.",
        data: [],
      };
    }

    const updateModel =
      new UpdateProcedimentoModel({
        id,
        nome,
        valor,
        profissionalId,
      });

    const payload: IUpdateProcedimento =
      updateModel.toPayload();

    const updatedResult =
      await new UpdateProcedimentoUseCase().execute(
        id,
        payload
      );

    return updatedResult;
  }
}