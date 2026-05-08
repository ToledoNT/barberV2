import { DeleteProcedimentoUseCase } from "../../use-case/procedimento/delete-procedimento-use-case";

export class DeleteProcedimentoController {
  async handle(id: string) {
    if (!id) {
      return {
        status: false,
        code: 400,
        message: "ID é obrigatório.",
        data: [],
      };
    }

    const deletedProcedimentoResult =
      await new DeleteProcedimentoUseCase().execute(
        id
      );

    return deletedProcedimentoResult;
  }
}