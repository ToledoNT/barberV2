import { CreateAppointmentUseCase } from "../../use-case/agendamento/create-agendamento-use-case";
import { VerificarCodigoUseCase } from "../../use-case/agendamento/email-verify-code-agendamento";
import { DeleteHorarioUseCase } from "../../use-case/horario/delete-horario-use-case";
import { GetHorarioByIdUseCase } from "../../use-case/horario/get-horario-by-id-use-case";
import { UpdateRelatorioUseCase } from "../../use-case/relatorio/update-relatorio-use-case";
import { SendEmailUseCase } from "../../use-case/resend/send-email-code";


export class VerificarCodigoController {
  async handle(email: string, codigo: string) {
    try {
      const result = await new VerificarCodigoUseCase().execute({
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

      const tipo = String(payload.tipo || "")
        .trim()
        .toLowerCase();

      switch (tipo) {
        case "unico":
          return await this.processarUnico(payload);

        case "grupo":
          return await this.processarGrupo(payload);

        default:
          return {
            status: false,
            code: 400,
            message: "Tipo de agendamento inválido",
            data: [],
          };
      }
    } catch (error) {
      console.error("Erro no VerificarCodigoController:", error);

      return {
        status: false,
        code: 500,
        message: "Erro interno do servidor.",
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido",
        data: [],
      };
    }
  }

  private async processarUnico(payload: any) {
    const profissionalId =
      typeof payload.profissional === "string"
        ? payload.profissional
        : payload.profissional?.id;

    const servicoId =
      typeof payload.servico === "string"
        ? payload.servico
        : payload.servico?.id;

    const horarioId =
      typeof payload.horario === "string"
        ? payload.horario
        : payload.horario?.id;

    if (!payload.cliente?.nome || !payload.cliente?.email) {
      return {
        status: false,
        code: 400,
        message: "Cliente inválido no payload",
        data: [],
      };
    }

    const horarioResponse =
      await new GetHorarioByIdUseCase().execute(horarioId);

    if (
      !horarioResponse?.status ||
      !horarioResponse.data?.data
    ) {
      return {
        status: false,
        code: 409,
        message:
          "Esse horário não está mais disponível. Atualize a página e selecione outro horário.",
        data: [],
      };
    }

    const horario = horarioResponse.data.data;

    if (!horario?.data || !horario?.inicio || !horario?.fim) {
      return {
        status: false,
        code: 409,
        message:
          "Horário inválido ou expirado. Atualize a página e tente novamente.",
        data: [],
      };
    }

    const created =
      await new CreateAppointmentUseCase().execute({
        nome: payload.cliente.nome,
        telefone: payload.cliente.telefone ?? "",
        email: payload.cliente.email,

        data: horario.data,
        inicio: horario.inicio,
        fim: horario.fim,

        servico: servicoId,
        profissional: profissionalId,
        status: "AGENDADO",
      } as any);

    if (!created?.status) {
      return {
        status: false,
        code: 500,
        message: "Erro ao criar agendamento.",
        data: [],
      };
    }

    await new DeleteHorarioUseCase().execute(horarioId);

    await this.atualizarRelatorio(horario.data);

    await new SendEmailUseCase().execute({
      from: "Agendamento <onboarding@resend.dev>",
      to: payload.cliente.email,
      subject: "Agendamento confirmado com sucesso",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Agendamento confirmado ✅</h2>

          <p>
            Seu e-mail foi confirmado com sucesso.
          </p>

          <p>
            Seu agendamento está confirmado.
          </p>

          <br />

          <p>
            Aguardamos você no horário marcado.
          </p>
        </div>
      `,
    });

    return {
      status: true,
      code: 200,
      message: "Agendamento criado com sucesso",
      data: created,
    };
  }

  private async processarGrupo(payload: any) {
    const participantes = payload.participantes || [];

    if (!payload.cliente?.nome || !payload.cliente?.email) {
      return {
        status: false,
        code: 400,
        message: "Cliente inválido no payload",
        data: [],
      };
    }

    if (!participantes.length) {
      return {
        status: false,
        code: 400,
        message: "Nenhum participante encontrado",
        data: [],
      };
    }

    const criarAgendamento =
      new CreateAppointmentUseCase();

    const resultados: any[] = [];

    let contadorAgendamentos = 0;

    for (const p of participantes) {
      const horario = p.horario;

      if (
        !horario?.data ||
        !horario?.inicio ||
        !horario?.fim ||
        !horario?.id
      ) {
        return {
          status: false,
          code: 409,
          message:
            "Um dos horários do grupo não está mais disponível. Atualize a página e selecione novamente.",
          data: [],
        };
      }
    }

    for (const p of participantes) {
      const profissionalId =
        typeof p.profissional === "string"
          ? p.profissional
          : p.profissional?.id;

      const servicoId =
        typeof p.servico === "string"
          ? p.servico
          : p.servico?.id;

      const horario = p.horario;

      const created =
        await criarAgendamento.execute({
          nome: payload.cliente.nome,
          telefone:
            payload.cliente.telefone ?? "",
          email: payload.cliente.email,

          data: horario.data,
          inicio: horario.inicio,
          fim: horario.fim,

          servico: servicoId,
          profissional: profissionalId,
          status: "AGENDADO",
        } as any);

      if (!created?.status) {
        return {
          status: false,
          code: 500,
          message:
            "Erro ao criar agendamento no grupo",
          data: [],
        };
      }

      await new DeleteHorarioUseCase().execute(
        horario.id
      );

      resultados.push(created);

      contadorAgendamentos++;
    }

    const primeiraData =
      participantes[0]?.horario?.data;

    if (primeiraData) {
      await this.atualizarRelatorioGrupo(
        primeiraData,
        contadorAgendamentos
      );
    }

    await new SendEmailUseCase().execute({
      from: "Agendamento <onboarding@resend.dev>",
      to: payload.cliente.email,
      subject: "Agendamentos confirmados com sucesso",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Agendamentos confirmados ✅</h2>

          <p>
            Seu e-mail foi confirmado com sucesso.
          </p>

          <p>
            Todos os seus agendamentos foram confirmados.
          </p>

          <br />

          <p>
            Aguardamos vocês nos horários marcados.
          </p>
        </div>
      `,
    });

    return {
      status: true,
      code: 200,
      message:
        "Agendamentos em grupo criados com sucesso",
      data: resultados,
    };
  }

  private async atualizarRelatorio(
    dataAgendamento: Date | string
  ) {
    try {
      const date = new Date(dataAgendamento);

      if (isNaN(date.getTime())) return;

      const mesAno = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      );

      await new UpdateRelatorioUseCase().execute({
        mesAno,
        agendamentos: 1,
      });
    } catch (err) {
      console.warn(
        "Erro ao atualizar relatório:",
        err
      );
    }
  }

  private async atualizarRelatorioGrupo(
    dataAgendamento: Date | string,
    quantidade: number
  ) {
    try {
      const date = new Date(dataAgendamento);

      if (isNaN(date.getTime())) return;

      const mesAno = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      );

      await new UpdateRelatorioUseCase().execute({
        mesAno,
        agendamentos: quantidade,
      });
    } catch (err) {
      console.warn(
        "Erro ao atualizar relatório do grupo:",
        err
      );
    }
  }
}