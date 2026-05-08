import { NextRequest, NextResponse } from "next/server";

import { CreateHorarioController } from "@/app/controller/horarios/generate-horario-controller";
import { GetAllHorariosController } from "@/app/controller/horarios/get-all-horarios-controller";
import { UpdateHorarioController } from "@/app/controller/horarios/update-horario-controller";
import { DeleteHorarioController } from "@/app/controller/horarios/delete-horario-controller";

/**
 * GET - LISTAR HORÁRIOS
 */
export async function GET(): Promise<NextResponse> {
  try {
    const controller =
      new GetAllHorariosController();

    const response =
      await controller.handle();

    return NextResponse.json(response, {
      status: response.code ?? 200,
    });
  } catch (error) {
    console.error("Erro na rota GET:", error);

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
 * POST - CRIAR HORÁRIO
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const body = await req.json();

    const controller =
      new CreateHorarioController();

    const response =
      await controller.handle(body);

    return NextResponse.json(response, {
      status: response.code ?? 201,
    });
  } catch (error) {
    console.error("Erro na rota POST:", error);

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
 * PUT - ATUALIZAR HORÁRIO
 */
export async function PUT(
  req: NextRequest
): Promise<NextResponse> {
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

    const controller =
      new UpdateHorarioController();

    const response =
      await controller.handle({
        id,
        ...data,
      });

    return NextResponse.json(response, {
      status: response.code ?? 200,
    });
  } catch (error) {
    console.error("Erro na rota PUT:", error);

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
 * DELETE - REMOVER HORÁRIO
 */
export async function DELETE(
  req: NextRequest
): Promise<NextResponse> {
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

    const controller =
      new DeleteHorarioController();

    const response =
      await controller.handle(id);

    return NextResponse.json(response, {
      status: response.code ?? 200,
    });
  } catch (error) {
    console.error(
      "Erro na rota DELETE:",
      error
    );

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