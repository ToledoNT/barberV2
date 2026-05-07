import { GetAllProfessionalsController } from "@/app/controller/get-all-profissional-controler";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const controller = new GetAllProfessionalsController();

    const response = await controller.handle();

    return NextResponse.json(response, {
      status: response.code ?? 200,
    });

  } catch (error) {
    console.error("Erro na rota:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Erro interno",
        data: [],
      },
      { status: 500 }
    );
  }
}