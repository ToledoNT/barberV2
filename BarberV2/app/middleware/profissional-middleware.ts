import { NextRequest, NextResponse } from "next/server";

export class ProfessionalMiddleware {
  async handleCreateProfessional(req: NextRequest) {
    const body = await req.json().catch(() => null);

    if (!body) {
      return {
        status: false,
        code: 400,
        message: "Body inválido",
        data: [],
      };
    }

    const { nome, email, telefone } = body;

    if (!nome || !email || !telefone) {
      return {
        status: false,
        code: 400,
        message: "Os campos 'nome', 'email' e 'telefone' são obrigatórios.",
        data: [],
      };
    }

    return { status: true };
  }

  async handleUpdateProfessional(req: NextRequest) {
    const body = await req.json().catch(() => null);

    if (!body) {
      return {
        status: false,
        code: 400,
        message: "Body inválido",
        data: [],
      };
    }

    const { id } = body;

    if (!id) {
      return {
        status: false,
        code: 400,
        message: "O campo 'id' é obrigatório para atualização.",
        data: [],
      };
    }

    return { status: true };
  }

  async handleDeleteProfessional(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return {
        status: false,
        code: 400,
        message: "O campo 'id' é obrigatório para deleção.",
        data: [],
      };
    }

    return { status: true, id };
  }
}