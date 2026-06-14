import { NextRequest, NextResponse } from "next/server";
import { GetProdutoByIdUseCase } from "../../use-case/produtos/get-produto-by-id-controller";

export class GetProdutoByIdController {
  async handle(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      // ============================
      // Validação
      // ============================
      if (!id) {
        return NextResponse.json(
          {
            status: false,
            code: 400,
            message: "O ID do produto é obrigatório.",
            data: null,
          },
          { status: 400 }
        );
      }

      const useCase = new GetProdutoByIdUseCase();
      const result = await useCase.execute(id);

      return NextResponse.json(result, {
        status: result.code || 200,
      });
    } catch (error: any) {
      console.error("Erro ao buscar produto por ID:", error);

      return NextResponse.json(
        {
          status: false,
          code: 500,
          message: error.message || "Erro ao buscar produto.",
          data: null,
        },
        { status: 500 }
      );
    }
  }
}