import { NextRequest, NextResponse } from "next/server";

import { GetAllProfessionalsController } from "@/app/controller/profissional/get-all-profissional-controler";
import { CreateProfessionalController } from "@/app/controller/profissional/create-profissional-controller";
import { UpdateProfessionalController } from "@/app/controller/profissional/update-profissional-controller";
import { DeleteProfessionalController } from "@/app/controller/profissional/delete-profissional-controller";
import { GetHorariosByBarbeiroController } from "@/app/controller/horarios/get-by-barbeiros-controller";

/**
 * GET - LISTAR PROFISSIONAIS
 * GET - HORÁRIOS (?barbeiroId=123)
 */

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const barbeiroId = searchParams.get("barbeiroId");

    /**
     * HORÁRIOS DO BARBEIRO
     */
    if (barbeiroId) {
      const controller = new GetHorariosByBarbeiroController();

      const response = await controller.handle(barbeiroId);

      return NextResponse.json(response, {
        status: response.code ?? 200,
      });
    }

    /**
     * LISTAR PROFISSIONAIS
     */
    const controller = new GetAllProfessionalsController();

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
 * POST - CRIAR PROFISSIONAL
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const controller = new CreateProfessionalController();

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
 * PUT - ATUALIZAR PROFISSIONAL
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

    const controller = new UpdateProfessionalController();

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
 * DELETE - REMOVER PROFISSIONAL
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

    const controller = new DeleteProfessionalController();

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