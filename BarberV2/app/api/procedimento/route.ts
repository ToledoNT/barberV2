import { NextRequest, NextResponse } from "next/server";

import { GetAllProcedimentosController } from "@/app/controller/procedimentos/get-all-procedimento-controller";
import { CreateProcedimentoController } from "@/app/controller/procedimentos/create-procedimento-controller";
import { UpdateProcedimentoController } from "@/app/controller/procedimentos/update-procedimento-controller";
import { DeleteProcedimentoController } from "@/app/controller/procedimentos/delete-procedimento-controller";

/**
 * GET - LISTAR PROCEDIMENTOS
 */
export async function GET(): Promise<NextResponse> {
  try {
    const controller = new GetAllProcedimentosController();

    const response = await controller.handle();

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
 * POST - CRIAR PROCEDIMENTO
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const controller = new CreateProcedimentoController();

    const response = await controller.handle(body);

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
 * PUT - ATUALIZAR PROCEDIMENTO
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

    const controller = new UpdateProcedimentoController();

    const response = await controller.handle({
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
 * DELETE - REMOVER PROCEDIMENTO
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

    const controller = new DeleteProcedimentoController();

    const response = await controller.handle(id);

    return NextResponse.json(response, {
      status: response.code ?? 200,
    });
  } catch (error) {
    console.error("Erro na rota DELETE:", error);

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