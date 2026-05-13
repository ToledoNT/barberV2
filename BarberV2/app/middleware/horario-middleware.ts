type HorarioInput = {
  profissional?: {
    id?: string;
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
    const { profissional, data } = body;

    if (
      !profissional ||
      typeof profissional !== "object" ||
      !profissional.id ||
      typeof profissional.id !== "string" ||
      profissional.id.trim() === ""
    ) {
      return {
        status: false,
        code: 400,
        message:
          "O campo 'profissional.id' é obrigatório e deve ser uma string válida.",
        data: null,
      };
    }

    if (!data || isNaN(Date.parse(data))) {
      return {
        status: false,
        code: 400,
        message:
          "O campo 'data' é obrigatório e deve ser uma data válida (YYYY-MM-DD).",
        data: null,
      };
    }

    return {
      status: true,
      code: 200,
      message: "ok",
      data: {
        ...body,
        data: new Date(data).toISOString().split("T")[0],
      },
    };
  }

  handleUpdateHorario(
    body: HorarioInput & { id?: string }
  ): ValidationResult {
    const { id } = body;

    if (!id || typeof id !== "string" || id.trim() === "") {
      return {
        status: false,
        code: 400,
        message: "O ID é obrigatório e deve ser uma string válida.",
        data: null,
      };
    }

    if ("disponivel" in body) {
      body.disponivel = !!body.disponivel;
    }

    return {
      status: true,
      code: 200,
      message: "ok",
      data: body,
    };
  }

  handleDeleteHorario(body: { id?: string }): ValidationResult<string> {
    const { id } = body;

    if (!id || typeof id !== "string" || id.trim() === "") {
      return {
        status: false,
        code: 400,
        message: "O ID é obrigatório para remover o horário.",
        data: null,
      };
    }

    return {
      status: true,
      code: 200,
      message: "ok",
      data: id,
    };
  }
}