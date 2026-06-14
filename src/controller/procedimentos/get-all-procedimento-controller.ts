import { GetAllProcedimentosUseCase } from "@/use-case/procedimento/get-all-procedimentos";

export class GetAllProcedimentosController {
  async handle() {
    const allProcedimentosResult =
      await new GetAllProcedimentosUseCase().execute();

    return allProcedimentosResult;
  }
}