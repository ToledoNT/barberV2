import { DeleteProfissionalUseCase } from "@/use-case/profissional/delete-profissional-use-case";

export class DeleteProfessionalController {
  async handle(profissionalId: string) {
    try {
      if (!profissionalId) {
        return {
          status: false,
          code: 400,
          message:
            "O campo 'id' é obrigatório para deletar o profissional.",
          data: [],
        };
      }

      const useCase =
        new DeleteProfissionalUseCase();

      const deleteResult =
        await useCase.execute(profissionalId);

      return deleteResult;

    } catch (error) {
      console.error(
        "Erro no controller (delete profissional):",
        error
      );

      return {
        status: false,
        code: 500,
        message: "Erro ao deletar profissional.",
        data: [],
      };
    }
  }
}