import { EnviarCodigoController } from "@/app/controller/appointments/enviar-email-controller";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { email, nome } = body;

    const controller = new EnviarCodigoController();

    const response = await controller.handle(email, nome);

    return NextResponse.json(response, {
      status: response?.code ?? 200,
    });
  } catch (error) {
    console.error("Erro ao enviar código:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Erro interno",
        data: null,
        code: 500,
      },
      { status: 500 }
    );
  }
}