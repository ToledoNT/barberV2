import { NextRequest, NextResponse } from "next/server";

import { CreateAppointmentController } from "@/app/controller/appointments/create-agendamento-controller";
import { GetAllAppointmentsController } from "@/app/controller/appointments/get-all-agendamentos-controler";
import { UpdateAppointmentController } from "@/app/controller/appointments/update-agendamento-controller";
import { DeleteAppointmentController } from "@/app/controller/appointments/delete-agendamento-controller";
import { GetHorariosByBarbeiroController } from "@/app/controller/horarios/get-by-barbeiros-controller";

/**
 * GET - LISTAR AGENDAMENTOS
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const barbeiro = searchParams.get("barbeiro");
    const data = searchParams.get("data");

    // ---------------- HORÁRIOS DISPONÍVEIS ----------------
    if (barbeiro && data) {
      const controller = new GetHorariosByBarbeiroController();

      const response = await controller.handle(barbeiro);

      return NextResponse.json(response, {
        status: response.code ?? 200,
      });
    }

    // ---------------- AGENDAMENTOS ----------------
    const controller = new GetAllAppointmentsController();

    const response = await controller.handle();

    return NextResponse.json(response, {
      status: response.code ?? 200,
    });
  } catch (error) {
    console.error("Erro GET agendamento:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Erro interno",
        data: [],
        code: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * POST - CRIAR AGENDAMENTO
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const controller = new CreateAppointmentController();

    const response = await controller.handle(body);

    return NextResponse.json(response, {
      status: response.code ?? 201,
    });
  } catch (error) {
    console.error("Erro POST agendamento:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Erro interno",
        data: [],
        code: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - ATUALIZAR AGENDAMENTO
 */
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "ID é obrigatório",
          data: [],
          code: 400,
        },
        { status: 400 }
      );
    }

    const controller = new UpdateAppointmentController();

    const response = await controller.handle({ id, ...data });

    return NextResponse.json(response, {
      status: response.code ?? 200,
    });
  } catch (error) {
    console.error("Erro PUT agendamento:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Erro interno",
        data: [],
        code: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - REMOVER AGENDAMENTO
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          message: "ID é obrigatório",
          data: [],
          code: 400,
        },
        { status: 400 }
      );
    }

    const controller = new DeleteAppointmentController();

    const response = await controller.handle(id);

    return NextResponse.json(response, {
      status: response.code ?? 200,
    });
  } catch (error) {
    console.error("Erro DELETE agendamento:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Erro interno",
        data: [],
        code: 500,
      },
      { status: 500 }
    );
  }
}