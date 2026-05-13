import { CreateAppointmentUseCase } from "@/app/use-case/agendamento/create-agendamento-use-case";
import { VerificarCodigoUseCase } from "@/app/use-case/agendamento/email-verify-code-agendamento";
import { GetHorarioByIdUseCase } from "@/app/use-case/horario/get-horario-by-id-use-case";
import { DeleteHorarioUseCase } from "@/app/use-case/horario/delete-horario-use-case";

export class VerificarCodigoController {
  async handle(email: string, codigo: string) {
    try {
      const useCaseCode = new VerificarCodigoUseCase();

      const result = await useCaseCode.execute({
        email,
        codigo,
      });

      if (!result?.status) {
        return result;
      }

      const payload: any = result.data?.payload;

      if (!payload) {
        return {
          status: false,
          code: 400,
          message: "Agendamento não encontrado no payload",
          data: [],
        };
      }

      const profissionalId =
        typeof payload.profissional === "string"
          ? payload.profissional
          : payload.profissional?.id;

      const servicoId =
        typeof payload.servico === "string"
          ? payload.servico
          : payload.servico?.id;

      const horarioId =
        payload.horario?.id || payload.horario;

      const horario = payload.horario || {};

      if (!profissionalId) {
        return {
          status: false,
          code: 400,
          message: "Profissional não informado no payload",
          data: [],
        };
      }

      if (!servicoId) {
        return {
          status: false,
          code: 400,
          message: "Serviço não informado no payload",
          data: [],
        };
      }

      if (!horario?.data || !horario?.inicio) {
        return {
          status: false,
          code: 400,
          message: "Horário inválido no payload",
          data: [],
        };
      }

      const horarioResponse = await new GetHorarioByIdUseCase().execute(horarioId);

      if (!horarioResponse?.status || !horarioResponse.data) {
        return {
          status: false,
          code: 404,
          message: "Horário não encontrado.",
          data: [],
        };
      }

      const horarioData = horarioResponse.data.data;

      const agendamentoFinal = {
        nome: payload.cliente?.nome,
        telefone: payload.cliente?.telefone ?? "",
        email: payload.cliente?.email,

        data: horarioData.data,
        inicio: horarioData.inicio,
        fim: horarioData.fim,

        servico: servicoId,
        profissional: profissionalId,
        status: "AGENDADO",
      };

      const criarAgendamento = new CreateAppointmentUseCase();
      const agendamentoCreated =
        await criarAgendamento.execute(agendamentoFinal as any);

      if (!agendamentoCreated?.status) {
        return {
          status: false,
          code: 500,
          message: "Erro ao criar agendamento.",
          data: [],
        };
      }

      const deleteHorario = new DeleteHorarioUseCase();
      const deleteResult = await deleteHorario.execute(horarioId);

      if (!deleteResult?.status) {
        console.warn(
          "Falha ao remover horário utilizado:",
          deleteResult.message
        );
      }

      return {
        status: true,
        code: 200,
        message: "Código validado e agendamento criado com sucesso",
        data: agendamentoCreated,
      };
    } catch (error) {
      console.error("Erro no VerificarCodigoController:", error);

      return {
        status: false,
        code: 500,
        message: "Erro interno do servidor.",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        data: [],
      };
    }
  }
}