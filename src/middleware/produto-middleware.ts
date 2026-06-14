import { NextRequest, NextResponse } from "next/server";

export class ProdutoMiddleware {
  static handleCreateProduto(req: NextRequest, body: any) {
    const {
      nome,
      preco,
      estoque,
      status,
      descricao,
      usuarioPendente,
      categoria,
    } = body;

    if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
      return NextResponse.json(
        { error: "Nome do produto é obrigatório." },
        { status: 400 }
      );
    }

    if (preco === undefined || isNaN(Number(preco)) || Number(preco) < 0) {
      return NextResponse.json(
        { error: "Preço inválido." },
        { status: 400 }
      );
    }

    if (
      estoque === undefined ||
      isNaN(Number(estoque)) ||
      Number(estoque) < 0
    ) {
      return NextResponse.json(
        { error: "Estoque inválido." },
        { status: 400 }
      );
    }

    const statusPermitidos = [
      "disponivel",
      "vendido",
      "consumido",
      "pendente",
    ];

    if (status && !statusPermitidos.includes(status)) {
      return NextResponse.json(
        {
          error: `Status inválido. Valores permitidos: ${statusPermitidos.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    if (descricao && typeof descricao !== "string") {
      return NextResponse.json(
        { error: "Descrição inválida." },
        { status: 400 }
      );
    }

    if (usuarioPendente && typeof usuarioPendente !== "string") {
      return NextResponse.json(
        { error: "Usuário pendente inválido." },
        { status: 400 }
      );
    }

    if (categoria && typeof categoria !== "string") {
      return NextResponse.json(
        { error: "Categoria inválida." },
        { status: 400 }
      );
    }

    return null;
  }
}