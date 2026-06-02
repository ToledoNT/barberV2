import {
  HorarioDTO,
  ProcedimentoDTO,
} from "@/app/interfaces/horario/get-horario-barbeiro-interface";

import { GetHorariosByBarbeiroUseCase } from "../../use-case/horario/get-by-barbeiro-use-case";
import { GetProcedimentosByProfissionalUseCase } from "@/src/use-case/procedimento/fetch-by-profissional-use-case";

export class GetHorariosByBarbeiroController {
  async handle(barbeiro: string, data?: string) {
    try {
      if (!barbeiro) {
        return {
          status: false,
          code: 400,
          message: "O parâmetro 'barbeiro' é obrigatório.",
          data: null,
        };
      }

      const horariosUseCase = new GetHorariosByBarbeiroUseCase();
      const procedimentosUseCase =
        new GetProcedimentosByProfissionalUseCase();

      const [horariosResult, procedimentosResult] =
        await Promise.all([
          horariosUseCase.execute(barbeiro),

          procedimentosUseCase.execute(barbeiro),
        ]);

      const horariosDisponiveis: HorarioDTO[] = (
        horariosResult?.data ?? []
      )
        .filter((h: any) => h?.disponivel === true)
        .map((h: any) => ({
          id: h.id,
          inicio: h.inicio,
          fim: h.fim,
          data: h.data,
          label: h.label ?? `${h.inicio} - ${h.fim}`,
          disponivel: h.disponivel,
        }));

      const procedimentos: ProcedimentoDTO[] = (
        procedimentosResult?.data ?? []
      ).map((p: any) => ({
        id: p.id,
        nome: p.nome,
        valor: p.valor,
        label:
          p.label ?? `${p.nome} - R$ ${Number(p.valor ?? 0).toFixed(2)}`,
      }));

      return {
        status: true,
        code: 200,
        message: "Dados carregados com sucesso",
        data: {
          barbeiroId: barbeiro,
          data: data ?? null,
          horarios: horariosDisponiveis,
          procedimentos,
        },
      };
    } catch (error) {
      console.error("Erro ao buscar dados do barbeiro:", error);

      return {
        status: false,
        code: 500,
        message: "Erro interno ao buscar dados.",
        data: null,
      };
    }
  }
}