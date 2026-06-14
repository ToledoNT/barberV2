import { PrismaProfessionalRepository } from "@/db/prisma/respositories/prisma-profissional-repository";
import { GetHorariosByBarbeiroUseCase } from "@/use-case/horario/get-by-barbeiro-use-case";
import { GetAllProfessionalsUseCase } from "@/use-case/profissional/get-all-profissional-use-case";

export class GetProfessionalFullDataController {
  async handle(barbeiroId?: string) {
    try {
      const repository = new PrismaProfessionalRepository();
      const profissionaisUseCase = new GetAllProfessionalsUseCase(repository);
      const horariosUseCase = new GetHorariosByBarbeiroUseCase();

      if (!barbeiroId) {
        const profissionaisResponse = await profissionaisUseCase.execute();
        const profissionais = profissionaisResponse?.data || [];

        const profissionaisCompletos = await Promise.all(
          profissionais.map(async (prof: any) => {
            const horarios = await horariosUseCase.execute(prof.id);

            const horariosDisponiveis = (horarios?.data || []).filter(
              (h: any) => h.disponivel === true
            );

            return {
              ...prof,
              horarios: horariosDisponiveis,
              procedimentos: prof.procedimentos || [],
            };
          })
        );

        return {
          status: true,
          message: "Profissionais carregados com procedimentos e horários",
          data: profissionaisCompletos,
          code: 200,
        };
      }

      const profissionaisResponse = await profissionaisUseCase.execute();
      const profissional = profissionaisResponse?.data?.find(
        (p: any) => p.id === barbeiroId
      );

      if (!profissional) {
        return {
          status: false,
          message: "Profissional não encontrado",
          data: null,
          code: 404,
        };
      }

      const horarios = await horariosUseCase.execute(barbeiroId);

      const horariosDisponiveis = (horarios?.data || []).filter(
        (h: any) => h.disponivel === true
      );

      return {
        status: true,
        message: "Dados carregados",
        data: {
          ...profissional,
          procedimentos: profissional.procedimentos || [],
          horarios: horariosDisponiveis,
        },
        code: 200,
      };
    } catch (error) {
      console.error("Erro controller:", error);

      return {
        status: false,
        message: "Erro interno",
        data: null,
        code: 500,
      };
    }
  }
}