export class ProfessionalMiddleware {
  handleCreateProfessional(body: any) {
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
        message:
          "Os campos 'nome', 'email' e 'telefone' são obrigatórios.",
        data: [],
      };
    }

    return { status: true };
  }

  handleUpdateProfessional(body: any) {
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
        message:
          "O campo 'id' é obrigatório para atualização.",
        data: [],
      };
    }

    return { status: true };
  }

  handleDeleteProfessional(id: string | null) {
    if (!id) {
      return {
        status: false,
        code: 400,
        message:
          "O campo 'id' é obrigatório para deleção.",
        data: [],
      };
    }

    return { status: true, id };
  }
}