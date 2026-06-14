import { GetProfessionalFullDataController } from "@/controller/profissional/get-profissional-full-data-controller";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const barbeiroId = searchParams.get("barbeiroId");

    const controller = new GetProfessionalFullDataController();

    const response = await controller.handle(barbeiroId ?? undefined);

    return NextResponse.json(response, {
      status: response?.code ?? 200,
    });
  } catch (error) {
    console.error("Erro dashboard barbeiros:", error);

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