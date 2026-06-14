import { NextRequest, NextResponse } from "next/server";
import { GetAllProdutosUseCase } from "../../use-case/produtos/get-all-produtos";

export class GetAllProdutosController {
  async handle(_req: NextRequest) {
    try {
      const result = await new GetAllProdutosUseCase().execute();
      const produtos = result.data || [];

      return NextResponse.json({
        status: true,
        code: 200,
        message: "Lista de produtos obtida com sucesso.",
        data: produtos,
      });
    } catch (error: any) {
      console.error("Erro ao buscar produtos:", error);

      return NextResponse.json(
        {
          status: false,
          code: 500,
          message: error.message || "Erro ao buscar produtos.",
          data: [],
        },
        { status: 500 }
      );
    }
  }
}