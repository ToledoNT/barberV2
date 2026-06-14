import { NextRequest, NextResponse } from "next/server";

import { IUpdateProduto } from "../../interface/produtos/update-produto-interface";
import { UpdateProdutoUseCase } from "../../use-case/produtos/update-produto-use-case";
import { CreateFinanceiroUseCase } from "../../use-case/financeiro/create-financeiro-use-case";
import { UpdateRelatorioUseCase } from "../../use-case/relatorio/update-relatorio-use-case";
import { GetProdutoByIdUseCase } from "../../use-case/produtos/get-produto-by-id-controller";

export class UpdateProdutoController {
  async handle(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      const body = await req.json();
      const {
        nome,
        descricao,
        preco,
        estoque,
        categoria,
        status,
        usuarioPendente,
      } = body;

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

      if (!nome) {
        return NextResponse.json(
          {
            status: false,
            code: 400,
            message: "O campo 'nome' é obrigatório.",
            data: null,
          },
          { status: 400 }
        );
      }

      const statusValido = status as
        | "disponivel"
        | "vendido"
        | "consumido"
        | "pendente"
        | undefined;

      if (!statusValido) {
        return NextResponse.json(
          {
            status: false,
            code: 400,
            message: "Status inválido.",
            data: null,
          },
          { status: 400 }
        );
      }

      // ============================
      // Buscar produto atual
      // ============================
      const getProdutoUseCase = new GetProdutoByIdUseCase();
      const produtoAtualResponse = await getProdutoUseCase.execute(id);
      const produtoAtual = produtoAtualResponse.data;

      if (!produtoAtual) {
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

      let statusParaAtualizar = statusValido;

      if (produtoAtual.status === "vendido") {
        statusParaAtualizar = "vendido";
      }

      // ============================================================
      // STATUS → PENDENTE
      // ============================================================
      if (
        statusParaAtualizar === "pendente" &&
        produtoAtual.status !== "pendente"
      ) {
        try {
          const updateRelatorio = new UpdateRelatorioUseCase();

          await updateRelatorio.execute({
            mesAno: new Date(),
            pendentes: 1,
            vendidos: 0,
            faturamento: 0,
            consumidos: 0,
          });
        } catch (err) {
          console.error("Erro ao processar pendência:", err);

          return NextResponse.json(
            {
              status: false,
              code: 500,
              message: "Erro ao processar status pendente.",
              data: null,
            },
            { status: 500 }
          );
        }
      }

      // ============================================================
      // STATUS → VENDIDO
      // ============================================================
      if (
        statusParaAtualizar === "vendido" &&
        produtoAtual.status !== "vendido"
      ) {
        try {
          const financeiroUseCase = new CreateFinanceiroUseCase();

          await financeiroUseCase.execute({
            clienteNome: nome,
            valor: Number(preco) || 0,
          });

          const estavaPendente = produtoAtual.status === "pendente";

          const updateRelatorio = new UpdateRelatorioUseCase();

          await updateRelatorio.execute({
            mesAno: new Date(),
            vendidos: 1,
            faturamento: Number(preco) || 0,
            pendentes: estavaPendente ? -1 : 0,
            consumidos: 0,
          });
        } catch (err) {
          console.error("Erro ao processar venda:", err);

          return NextResponse.json(
            {
              status: false,
              code: 500,
              message: "Erro interno ao processar venda.",
              data: null,
            },
            { status: 500 }
          );
        }
      }

      // ============================================================
      // STATUS → CONSUMIDO
      // ============================================================
      if (
        statusParaAtualizar === "consumido" &&
        produtoAtual.status !== "consumido"
      ) {
        try {
          const estavaPendente = produtoAtual.status === "pendente";

          const updateRelatorio = new UpdateRelatorioUseCase();

          await updateRelatorio.execute({
            mesAno: new Date(),
            consumidos: 1,
            vendidos: 0,
            faturamento: 0,
            pendentes: estavaPendente ? -1 : 0,
          });
        } catch (err) {
          console.error("Erro ao processar consumo:", err);

          return NextResponse.json(
            {
              status: false,
              code: 500,
              message: "Erro interno ao processar consumo.",
              data: null,
            },
            { status: 500 }
          );
        }
      }

      const dataAtualizacao: IUpdateProduto = {
        id,
        nome,
        descricao: descricao ?? "",
        preco: Number(preco) || 0,
        estoque: estoque !== undefined ? Number(estoque) : undefined,
        categoria: categoria ?? "",
        status: statusParaAtualizar,
        usuarioPendente: usuarioPendente ?? "",
        atualizadoEm: new Date(),
      };

      const updateUseCase = new UpdateProdutoUseCase();
      const result = await updateUseCase.execute(dataAtualizacao);

      return NextResponse.json(result, {
        status: result.code || 200,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);

      return NextResponse.json(
        {
          status: false,
          code: 500,
          message: error.message || "Erro interno ao atualizar produto.",
          data: null,
        },
        { status: 500 }
      );
    }
  }
}