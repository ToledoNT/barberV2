import { NextRequest, NextResponse } from "next/server";

import { CreateProdutoUseCase } from "../../use-case/produtos/create-produto-use-case";
import { ICreateProduto } from "../../interface/produtos/create-produto-interface";
import { UpdateRelatorioUseCase } from "../../use-case/relatorio/update-relatorio-use-case";

export class CreateProdutoController {
  async handle(req: NextRequest) {
    try {
      const body = await req.json();

      const { nome, descricao, preco, estoque, categoria } = body;

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

      if (preco == null || isNaN(Number(preco))) {
        return NextResponse.json(
          {
            status: false,
            code: 400,
            message: "O campo 'preco' é obrigatório e deve ser numérico.",
            data: null,
          },
          { status: 400 }
        );
      }

      if (estoque == null || isNaN(Number(estoque))) {
        return NextResponse.json(
          {
            status: false,
            code: 400,
            message: "O campo 'estoque' é obrigatório e deve ser numérico.",
            data: null,
          },
          { status: 400 }
        );
      }

      const useCase = new CreateProdutoUseCase();
      const updateRelatorio = new UpdateRelatorioUseCase();

      const agora = new Date().toISOString();
      const quantidade = Number(estoque);

      const produtosCriados = [];

      for (let i = 0; i < quantidade; i++) {
        const produto: ICreateProduto = {
          nome,
          descricao: descricao ?? "",
          preco: Number(preco),
          estoque: 1,
          categoria: categoria ?? undefined,
          ativo: true,
          criadoEm: agora,
          atualizadoEm: agora,
        };

        const novoProduto = await useCase.execute(produto);
        produtosCriados.push(novoProduto);
      }

      await updateRelatorio.execute({
        mesAno: new Date(),
        disponiveis: quantidade,
        agendamentos: 0,
        faturamento: 0,
        cancelados: 0,
        naoCompareceu: 0,
        vendidos: 0,
        consumidos: 0,
        pendentes: 0,
      });

      return NextResponse.json(
        {
          status: true,
          code: 201,
          message: `Produto(s) criado(s) com sucesso: ${quantidade} unidade(s).`,
          data: produtosCriados,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Erro ao criar produto:", error);

      return NextResponse.json(
        {
          status: false,
          code: 500,
          message: error.message || "Erro ao criar produto.",
          data: null,
        },
        { status: 500 }
      );
    }
  }
}