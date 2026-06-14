import { NextRequest } from "next/server";

export class ProcedimentoMiddleware {
  async handleCreateProcedimento(req: NextRequest) {
    const body = await req.json().catch(() => null);

    if (!body) {
      return {
        status: false,
        code: 400,
        message: "Body inválido",
        data: [],
      };
    }

    const { nome, valor, profissionalId } = body;

    if (!nome || typeof nome !== "string" || nome.trim() === "") {
      return {
        status: false,
        code: 400,
        message: "Nome é obrigatório.",
        data: [],
      };
    }

    const valorNumero = Number(valor);

    if (isNaN(valorNumero) || valorNumero < 0) {
      return {
        status: false,
        code: 400,
        message: "Valor deve ser um número maior ou igual a 0.",
        data: [],
      };
    }

    if (
      !profissionalId ||
      typeof profissionalId !== "string" ||
      profissionalId.trim() === ""
    ) {
      return {
        status: false,
        code: 400,
        message: "profissionalId é obrigatório.",
        data: [],
      };
    }

    return {
      status: true,
      data: {
        ...body,
        valor: valorNumero,
      },
    };
  }

async handleUpdateProcedimento(
  req: NextRequest
) {
  const body = await req
    .json()
    .catch(() => null);

  if (!body) {
    return {
      status: false,
      code: 400,
      message: "Body inválido",
      data: [],
    };
  }

  const { searchParams } =
    new URL(req.url);

  const id =
    searchParams.get("id");

  const {
    nome,
    valor,
    profissionalId,
  } = body;

  if (
    !id ||
    typeof id !== "string" ||
    id.trim() === ""
  ) {
    return {
      status: false,
      code: 400,
      message: "ID é obrigatório.",
      data: [],
    };
  }

  if (
    !nome ||
    typeof nome !== "string" ||
    nome.trim() === ""
  ) {
    return {
      status: false,
      code: 400,
      message: "Nome é obrigatório.",
      data: [],
    };
  }

  const valorNumero =
    Number(valor);

  if (
    isNaN(valorNumero) ||
    valorNumero < 0
  ) {
    return {
      status: false,
      code: 400,
      message:
        "Valor deve ser um número maior ou igual a 0.",
      data: [],
    };
  }

  if (
    !profissionalId ||
    typeof profissionalId !==
      "string" ||
    profissionalId.trim() === ""
  ) {
    return {
      status: false,
      code: 400,
      message:
        "profissionalId é obrigatório.",
      data: [],
    };
  }

  return {
    status: true,
    data: {
      id,
      nome,
      valor: valorNumero,
      profissionalId,
    },
  };
}
  async handleDeleteProcedimento(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id || id.trim() === "") {
      return {
        status: false,
        code: 400,
        message: "ID é obrigatório para remover procedimento.",
        data: [],
      };
    }

    return {
      status: true,
      id,
    };
  }
}