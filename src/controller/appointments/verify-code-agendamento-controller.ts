import { CreateAppointmentUseCase } from "@/use-case/agendamento/create-agendamento-use-case";
import { VerificarCodigoUseCase } from "@/use-case/agendamento/email-verify-code-agendamento";
import { DeleteHorarioUseCase } from "@/use-case/horario/delete-horario-use-case";
import { GetHorarioByIdUseCase } from "@/use-case/horario/get-horario-by-id-use-case";
import { UpdateRelatorioUseCase } from "@/use-case/relatorio/update-relatorio-use-case";
import { SendEmailUseCase } from "@/use-case/resend/send-email-code";

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

  if (!horarioId) {
    return {
      status: false,
      code: 400,
      message: "Horário não informado",
      data: [],
    };
  }

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

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${horario.data}T00:00:00Z`));


  try {
    await new SendEmailUseCase().execute({
      from: "Agendamento <onboarding@resend.dev>",
      to: payload.cliente.email,
      subject: "Agendamento confirmado com sucesso",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #333;
        ">
          <h2 style="color: #16a34a;">
            ✅ Agendamento confirmado
          </h2>

          <p>
            Olá, <strong>${payload.cliente.nome}</strong>!
          </p>

          <p>
            Seu e-mail foi confirmado com sucesso e seu agendamento está garantido.
          </p>

          <div style="
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
          ">
            <h3>
              📋 Detalhes do agendamento
            </h3>

            <p>
              <strong>📅 Data:</strong> ${dataFormatada}
            </p>

            <p>
              <strong>🕒 Horário:</strong> ${horario.inicio} às ${horario.fim}
            </p>
          </div>

          <p>
            Aguardamos você no horário marcado.
          </p>

          <p style="margin-top: 32px;">
            Atenciosamente,<br />
            <strong>Equipe de Agendamentos</strong>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erro ao enviar email de confirmação:", error);
  }

  return {
    status: true,
    code: 200,
    message: "Agendamento criado com sucesso",
    data: JSON.parse(JSON.stringify(created)),
  };
}

 private async processarGrupo(payload: any) {
  const participantes = payload.participantes || [];

  if (!payload.cliente?.email) {
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

  const criarAgendamento = new CreateAppointmentUseCase();
  const resultados: any[] = [];
  const horariosConfirmados: string[] = [];

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

    const created = await criarAgendamento.execute({
      nome: p.pessoaNome ?? "Sem nome",

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
        message: "Erro ao criar agendamento no grupo",
        data: [],
      };
    }

    await new DeleteHorarioUseCase().execute(horario.id);

    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${horario.data}T00:00:00Z`));


    horariosConfirmados.push(`
      <li style="margin-bottom: 10px;">
        <strong>${p.pessoaNome ?? "Participante"}</strong><br/>
        📅 ${dataFormatada}<br/>
        🕒 ${horario.inicio} às ${horario.fim}
      </li>
    `);

    resultados.push(created);
    contadorAgendamentos++;
  }

  const primeiraData = participantes[0]?.horario?.data;

  if (primeiraData) {
    await this.atualizarRelatorioGrupo(
      primeiraData,
      contadorAgendamentos
    );
  }

  try {
    await new SendEmailUseCase().execute({
      from: "Agendamento <onboarding@resend.dev>",
      to: payload.cliente.email,
      subject: "Agendamentos confirmados com sucesso",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #333;
        ">
          <h2 style="color: #16a34a;">
            ✅ Agendamentos confirmados
          </h2>

          <p>
            Olá, <strong>${payload.cliente.nome ?? "cliente"}</strong>!
          </p>

          <p>
            Seu e-mail foi confirmado com sucesso.
            Todos os agendamentos do grupo foram confirmados.
          </p>

          <div style="
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
          ">
            <h3>
              📋 Detalhes dos agendamentos
            </h3>

            <ul style="padding-left: 20px;">
              ${horariosConfirmados.join("")}
            </ul>
          </div>

          <p>
            Aguardamos vocês nos horários marcados.
          </p>

          <p style="margin-top: 32px;">
            Atenciosamente,<br/>
            <strong>Equipe de Agendamentos</strong>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erro ao enviar email do grupo:", error);
  }

  return {
    status: true,
    code: 200,
    message: "Agendamentos em grupo criados com sucesso",
    data: JSON.parse(JSON.stringify(resultados)),
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