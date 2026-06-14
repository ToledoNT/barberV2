
import { ICreateHorario } from "@/interface/horario/create-horario-interface";
import { CreateFinanceiroUseCase } from "@/use-case/financeiro/create-financeiro-use-case";
import { GetAppointmentByIdUseCase } from "@/use-case/agendamento/get-agendamento-by-id-use-case";
import { UpdateAppointmentUseCase } from "@/use-case/agendamento/update-agendamento-use-case";
import { CreateHorarioUseCase } from "@/use-case/horario/create-horario-use-case";
import { UpdateRelatorioUseCase } from "@/use-case/relatorio/update-relatorio-use-case";
import { StatusAgendamento } from "@/interface/agendamentos/status-agendamento-interface";

export class UpdateAppointmentController {
  async handle(body: {
    id: string;
    status: StatusAgendamento;
  }) {
    const { id, status } = body;

    if (!id || !status) {
      return {
        status: false,
        code: 400,
        message: `Campos obrigatórios faltando: ${
          !id ? "id" : ""
        } ${!status ? "status" : ""}`.trim(),
        data: [],
      };
    }

    const appointmentResponse =
      await new GetAppointmentByIdUseCase().execute(id);

    if (
      !appointmentResponse.status ||
      !appointmentResponse.data?.data
    ) {
      return {
        status: false,
        code: 404,
        message: "Agendamento não encontrado",
        data: [],
      };
    }

    const agendamento = appointmentResponse.data;

    const statusProtegidos = [
      StatusAgendamento.CONCLUIDO,
      StatusAgendamento.CANCELADO,
      StatusAgendamento.NAO_COMPARECEU,
    ];

    if (
      statusProtegidos.includes(agendamento.status) &&
      status !== agendamento.status
    ) {
      const mensagens: Partial<Record<StatusAgendamento, string>> = {
        [StatusAgendamento.CONCLUIDO]:
          "Agendamento já concluído não pode ter o status alterado",

        [StatusAgendamento.CANCELADO]:
          "Agendamento cancelado não pode ter o status alterado",

        [StatusAgendamento.NAO_COMPARECEU]:
          "Agendamento marcado como não compareceu não pode ter o status alterado",
      };

      return {
        status: false,
        code: 400,
        message:
          mensagens[agendamento.status as StatusAgendamento] ??
          "Status inválido",
        data: [],
      };
    }

    let updatedAppointment;

    try {
      updatedAppointment =
        await new UpdateAppointmentUseCase().execute({
          id,
          status,
        });

      /**
       * CONCLUÍDO
       */
      if (
        status === StatusAgendamento.CONCLUIDO &&
        agendamento.status !== StatusAgendamento.CONCLUIDO
      ) {
        const clienteNome =
          agendamento.nome ?? "Cliente não informado";

        const valor =
          agendamento.servicoPreco ??
          agendamento.servico?.valor ??
          0;

        await new CreateFinanceiroUseCase().execute({
          agendamentoId: agendamento.id,
          clienteNome,
          valor,
          status: StatusAgendamento.PAGO,
          profissionalNome: agendamento.profissionalNome,
        });

        await new UpdateRelatorioUseCase().execute({
          mesAno: new Date(
            agendamento.criadoEm.getFullYear(),
            agendamento.criadoEm.getMonth(),
            1
          ),
          faturamento: valor,
        });
      }

      /**
       * CANCELADO
       */
      if (
        status === StatusAgendamento.CANCELADO &&
        agendamento.status !== StatusAgendamento.CANCELADO
      ) {
        const horarioParaCriar: ICreateHorario = {
          profissionalId: agendamento.profissionalId,
          data: agendamento.data,
          inicio: agendamento.inicio,
          fim: agendamento.fim,
          disponivel: true,
        };

        await new CreateHorarioUseCase().execute(horarioParaCriar);

        const mesAno = new Date(
          agendamento.criadoEm.getFullYear(),
          agendamento.criadoEm.getMonth(),
          1
        );

        await new UpdateRelatorioUseCase().execute({
          mesAno,
          cancelados: 1,
        });
      }

      /**
       * NÃO COMPARECEU
       */
      if (
        status === StatusAgendamento.NAO_COMPARECEU &&
        agendamento.status !== StatusAgendamento.NAO_COMPARECEU
      ) {
        const mesAno = new Date(
          agendamento.criadoEm.getFullYear(),
          agendamento.criadoEm.getMonth(),
          1
        );

        await new UpdateRelatorioUseCase().execute({
          mesAno,
          naoCompareceu: 1,
        });
      }
    } catch (err) {
      console.error(
        "Erro ao atualizar agendamento ou processar lógica extra:",
        err
      );

      return {
        status: false,
        code: 500,
        message: "Erro ao atualizar agendamento",
        data: [],
      };
    }

    return {
      status: true,
      code: 200,
      message: "Agendamento atualizado com sucesso",
      data: updatedAppointment,
    };
  }
}