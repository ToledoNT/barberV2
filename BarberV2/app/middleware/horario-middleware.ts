type HorarioInput = {
  body?: {
    profissional?: {
      id?: string;
      nome?: string;
      horarios?: any[];
    };
    data?: string;
    disponivel?: boolean;
  };

  profissional?: {
    id?: string;
    nome?: string;
    horarios?: any[];
  };

  data?: string;
  disponivel?: boolean;
};

type ValidationResult<T = any> = {
  status: boolean;
  code: number;
  message: string;
  data: T | null;
};

export class HorarioMiddleware {
  handleCreateHorario(body: HorarioInput): ValidationResult {
    const payload = body?.body ? body.body : body;

    const profissionalId = payload?.profissional?.id;
    const data = payload?.data;
    const disponivel = payload?.disponivel;

    if (
      !profissionalId ||
      typeof profissionalId !== "string" ||
      profissionalId.trim() === ""
    ) {
      return {
        status: false,
        code: 400,
        message:
          "O campo profissional.id é obrigatório e deve ser uma string válida.",
        data: null,
      };
    }

    if (
      !data ||
      typeof data !== "string" ||
      isNaN(Date.parse(data))
    ) {
      return {
        status: false,
        code: 400,
        message:
          "O campo data é obrigatório e deve possuir uma data válida.",
        data: null,
      };
    }

    return {
      status: true,
      code: 200,
      message: "Horário validado com sucesso.",
      data: {
        profissionalId,
        data: new Date(data)
          .toISOString()
          .split("T")[0],
        disponivel:
          typeof disponivel === "boolean"
            ? disponivel
            : true,
      },
    };
  }

  handleUpdateHorario(
    body: HorarioInput & { id?: string }
  ): ValidationResult {
    const payload = body?.body ? body.body : body;

    const id = body?.id;
    const profissionalId = payload?.profissional?.id;

    if (
      !id ||
      typeof id !== "string" ||
      id.trim() === ""
    ) {
      return {
        status: false,
        code: 400,
        message: "O ID do horário é obrigatório.",
        data: null,
      };
    }

    return {
      status: true,
      code: 200,
      message: "Horário validado com sucesso.",
      data: {
        id,
        profissionalId,
        data: payload?.data,
        disponivel:
          typeof payload?.disponivel === "boolean"
            ? payload.disponivel
            : undefined,
      },
    };
  }

  handleDeleteHorario(
    body: { id?: string }
  ): ValidationResult<string> {
    const id = body?.id;

    if (
      !id ||
      typeof id !== "string" ||
      id.trim() === ""
    ) {
      return {
        status: false,
        code: 400,
        message:
          "O ID é obrigatório para remover o horário.",
        data: null,
      };
    }

    return {
      status: true,
      code: 200,
      message: "Horário validado com sucesso.",
      data: id,
    };
  }
}