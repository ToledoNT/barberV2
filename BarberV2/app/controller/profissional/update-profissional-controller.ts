import { IUpdateProfessional } from "../../../../../KingsBarberShopBackend/src/interface/profissional/update-profissional-interface";
import { UpdateProfissionalUseCase } from "../../use-case/profissional/update-profissional-use-case";

export class UpdateProfessionalController {
  async handle(data: IUpdateProfessional) {
    try {
      const {
        id,
        nome,
        email,
        telefone,
        procedimentos,
      } = data;

      if (!id) {
        return {
          status: false,
          code: 400,
          message:
            "O campo 'id' é obrigatório para atualização.",
          data: [],
        };
      }

      const payload: IUpdateProfessional = {
        id,
        nome,
        email,
        telefone,
        procedimentos,
      };

      const updateUseCase =
        new UpdateProfissionalUseCase();

      const updatedProfessionalResult =
        await updateUseCase.execute(payload);

      return updatedProfessionalResult;

    } catch (error) {
      console.error(
        "Erro no controller (update profissional):",
        error
      );

      return {
        status: false,
        code: 500,
        message: "Erro ao atualizar profissional.",
        data: [],
      };
    }
  }
}