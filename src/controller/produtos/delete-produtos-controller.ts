import { NextRequest, NextResponse } from "next/server";
import { DeleteProdutoUseCase } from "../../use-case/produtos/delete-produtos-use-case";
import { GetProdutoByIdUseCase } from "../../use-case/produtos/get-produto-by-id-controller";

export class DeleteProdutoController {
  async handle(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

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

      const getProduto = new GetProdutoByIdUseCase();
      const produto = await getProduto.execute(id);

      if (!produto || !produto.data) {
        return NextResponse.json(
          {
            status: false,
            code: 404,
            message: "Produto não encontrado.",
            data: null,
          },
          { status: 404 }
        );
      }

      if (produto.data.status === "pendente") {
        return NextResponse.json(
          {
            status: false,
            code: 403,
            message:
              "Não é permitido excluir produtos com status 'pendente'.",
            data: null,
          },
          { status: 403 }
        );
      }

      const useCase = new DeleteProdutoUseCase();
      const result = await useCase.execute(id);

      return NextResponse.json(result, {
        status: result.code || 200,
      });
    } catch (error: any) {
      console.error("Erro ao deletar produto:", error);

      return NextResponse.json(
        {
          status: false,
          code: 500,
          message: error.message || "Erro ao deletar produto.",
          data: null,
        },
        { status: 500 }
      );
    }
  }
}