export class AppointmentMiddleware {
  handleCreateAppointment(body: any) {
    const {
      nome,
      telefone,
      email,
      barbeiro,
      data,
      hora,
      servico,
      status,
      inicio,
      fim,
    } = body;

    if (
      !nome ||
      !telefone ||
      !data ||
      !hora ||
      !servico ||
      !barbeiro ||
      !inicio ||
      !fim ||
      status === undefined ||
      status === null
    ) {
      return {
        status: false,
        code: 400,
        message: "Todos os campos obrigatórios devem ser preenchidos.",
        data: [],
      };
    }

    return { status: true };
  }

  handleUpdateAppointment(body: any) {
    const {
      id,
      nome,
      telefone,
      email,
      data,
      inicio,
      fim,
      servico,
      barbeiro,
      status,
    } = body;

    if (!id) {
      return {
        status: false,
        code: 400,
        message: "O campo 'id' é obrigatório para atualização.",
        data: [],
      };
    }

    const hasAnyField =
      nome ||
      telefone ||
      email ||
      data ||
      inicio ||
      fim ||
      servico ||
      barbeiro ||
      status !== undefined;

    if (!hasAnyField) {
      return {
        status: false,
        code: 400,
        message: "Nenhum campo fornecido para atualização.",
        data: [],
      };
    }

    return { status: true };
  }

  handleDeleteAppointment(id: string | null | undefined) {
    if (!id) {
      return {
        status: false,
        code: 400,
        message: "O campo 'id' é obrigatório para deleção.",
        data: [],
      };
    }

    return { status: true };
  }
}