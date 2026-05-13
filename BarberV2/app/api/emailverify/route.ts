import { EnviarCodigoController } from "@/app/controller/appointments/enviar-email-pre-agendamento-controller";
import { VerificarCodigoController } from "@/app/controller/appointments/verify-code-agendamento-controller";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST -> Enviar código
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { email, nome, agendamento } = body;

    const controller = new EnviarCodigoController();

    const response = await controller.handle(
      email,
      nome,
      agendamento
    );

    return NextResponse.json(response, {
      status: response?.code ?? 200,
    });
  } catch (error) {
    console.error("Erro ao enviar código:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Erro interno ao enviar código",
        data: null,
        code: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT -> Verificar código
 */
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { email, codigo, agendamento } = body;

    if (!email || !codigo) {
      return NextResponse.json(
        {
          status: false,
          message: "Email e código são obrigatórios",
          data: null,
          code: 400,
        },
        { status: 400 }
      );
    }

    const controller = new VerificarCodigoController();

    const response = await controller.handle(email, codigo, agendamento);

    return NextResponse.json(response, {
      status: response?.code ?? 200,
    });
  } catch (error) {
    console.error("Erro ao verificar código:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Erro interno ao verificar código",
        data: null,
        code: 500,
      },
      { status: 500 }
    );
  }
}