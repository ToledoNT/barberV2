
import { GetHorarioByIdUseCase } from "../../use-case/horario/get-horario-by-id-use-case";
import { GetBarbeiroByIdUseCase } from "@/use-case/agendamento/get-barbeiro-by-id";
import { CreateAppointmentUseCase } from "@/use-case/agendamento/create-agendamento-use-case";
import { UpdateRelatorioUseCase } from "@/use-case/relatorio/update-relatorio-use-case";
import { DeleteHorarioUseCase } from "@/use-case/horario/delete-horario-use-case";
import { ICreateAppointment } from "@/interface/agendamentos/create-agendamento-interface";
import { StatusAgendamento } from "app/interfaces/agendamentoInterface";

export class CreateAppointmentController {
  async handle(body: any) {
    try {
      const data: ICreateAppointment = {
        nome: body.nome,
        telefone: body.telefone,
        email: body.email,
        data: body.data,
        hora: body.hora,
        servico: body.servico,
        profissional: body.barbeiro,
        inicio: body.inicio,
        fim: body.fim,
        status: StatusAgendamento.AGENDADO,
      };

      if (
        !data.nome ||
        !data.telefone ||
        !data.data ||
        !data.hora ||
        !data.servico ||
        !data.profissional ||
        !data.inicio ||
        !data.fim
      ) {
        return {
          status: false,
          code: 400,
          message:
            "Todos os campos obrigatórios devem ser preenchidos.",
          data: [],
        };
      }

      const barbeiroResponse =
        await new GetBarbeiroByIdUseCase().execute(
          data.profissional
        );

      if (
        !barbeiroResponse?.status ||
        !barbeiroResponse.data
      ) {
        return {
          status: false,
          code: 404,
          message: "Barbeiro não encontrado.",
          data: [],
        };
      }

      const horarioResponse =
        await new GetHorarioByIdUseCase().execute(
          data.hora
        );

      if (
        !horarioResponse?.status ||
        !horarioResponse.data
      ) {
        return {
          status: false,
          code: 404,
          message: "Horário não encontrado.",
          data: [],
        };
      }

      const horario =
        horarioResponse.data.data;

      const normalizarData = (
        dataString: string
      ): string => {
        try {
          if (
            /^\d{4}-\d{2}-\d{2}$/.test(
              dataString
            )
          ) {
            return dataString;
          }

          const dataObj = new Date(dataString);

          if (isNaN(dataObj.getTime())) {
            throw new Error("Data inválida");
          }

          const ano =
            dataObj.getFullYear();

          const mes = String(
            dataObj.getMonth() + 1
          ).padStart(2, "0");

          const dia = String(
            dataObj.getDate()
          ).padStart(2, "0");

          return `${ano}-${mes}-${dia}`;
        } catch (error) {
          console.error(
            "Erro ao normalizar data:",
            dataString,
            error
          );

          throw new Error(
            `Data inválida: ${dataString}`
          );
        }
      };

      const horarioDataNormalizada =
        normalizarData(horario.data);

      const dataAgendamentoNormalizada =
        normalizarData(data.data);

      const mesmaData =
        horarioDataNormalizada ===
        dataAgendamentoNormalizada;

      const mesmoInicio =
        horario.inicio === data.inicio;

      const mesmoFim =
        horario.fim === data.fim;

      const mesmoProfissional =
        horario.profissionalId ===
        data.profissional;

      if (
        !mesmaData ||
        !mesmoInicio ||
        !mesmoFim ||
        !mesmoProfissional
      ) {
        return {
          status: false,
          code: 409,
          message:
            "O horário não corresponde ao registrado. Verifique os dados.",
          details: {
            mesmaData,
            mesmoInicio,
            mesmoFim,
            mesmoProfissional,
            horarioData:
              horarioDataNormalizada,
            agendamentoData:
              dataAgendamentoNormalizada,
          },
          data: [],
        };
      }

      const appointmentResult =
        await new CreateAppointmentUseCase().execute(
          data
        );

      if (!appointmentResult?.status) {
        return {
          status: false,
          code: 500,
          message:
            "Erro ao criar agendamento.",
          data: [],
        };
      }

      const deleteResult =
        await new DeleteHorarioUseCase().execute(
          data.hora
        );

      if (!deleteResult?.status) {
        console.warn(
          "Falha ao remover o horário utilizado:",
          deleteResult.message
        );
      }

      const updateRelatorioUseCase =
        new UpdateRelatorioUseCase();

      await updateRelatorioUseCase.execute({
        mesAno: new Date(
          new Date(
            dataAgendamentoNormalizada
          ).getFullYear(),
          new Date(
            dataAgendamentoNormalizada
          ).getMonth(),
          1
        ),
        agendamentos: 1,
      });

      return {
        ...appointmentResult,
        code:
          appointmentResult.code ?? 201,
      };
    } catch (error) {
      console.error(
        "Erro no CreateAppointmentController:",
        error
      );

      return {
        status: false,
        code: 500,
        message:
          "Erro interno do servidor.",
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido",
        data: [],
      };
    }
  }
}