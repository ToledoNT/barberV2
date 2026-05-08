import { HorarioDTO, ProcedimentoDTO } from "@/app/interfaces/horario/get-horario-barbeiro-interface";
import { GetHorariosByBarbeiroUseCase } from "../../use-case/horario/get-by-barbeiro-use-case";


import { GetProcedimentosByProfissionalUseCase } from "@/app/use-case/procedimento/fetch-by-profissional-use-case";

export class GetHorariosByBarbeiroController {
  async handle(barbeiro: string) {
    try {
      if (!barbeiro) {
        return {
          status: false,
          code: 400,
          message:
            "O parâmetro 'barbeiro' é obrigatório.",
          data: null,
        };
      }

      const [
        horariosResult,
        procedimentosResult,
      ] = await Promise.all([
        new GetHorariosByBarbeiroUseCase().execute(
          barbeiro
        ),

        new GetProcedimentosByProfissionalUseCase().execute(
          barbeiro
        ),
      ]);

      const horariosDisponiveis: HorarioDTO[] =
        (horariosResult.data || [])
          .filter((h: any) => h.disponivel)
          .map((h: any) => ({
            id: h.id,
            inicio: h.inicio,
            fim: h.fim,
            data: h.data,
            label:
              h.label ??
              `${h.inicio} - ${h.fim}`,
            disponivel: h.disponivel,
          }));

      const procedimentos: ProcedimentoDTO[] =
        (procedimentosResult.data || []).map(
          (p: any) => ({
            id: p.id,
            nome: p.nome,
            valor: p.valor,
            label:
              p.label ??
              `${p.nome} - R$${p.valor.toFixed(2)}`,
          })
        );

      const responseData = {
        barbeiroId: barbeiro,
        horarios: horariosDisponiveis,
        procedimentos,
      };

      return {
        status: true,
        code: 200,
        message:
          "Dados carregados com sucesso",
        data: responseData,
      };

    } catch (error) {
      console.error(
        "Erro ao buscar dados do barbeiro:",
        error
      );

      return {
        status: false,
        code: 500,
        message:
          "Erro interno ao buscar dados.",
        data: null,
      };
    }
  }
}