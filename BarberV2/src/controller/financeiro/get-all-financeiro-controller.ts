
import { GetAllFinanceiroUseCase } from "@/use-case/financeiro/get-all-financeiro";
import { GetAllProdutosUseCase } from "@/use-case/produtos/get-all-produtos";
import { NextRequest, NextResponse } from "next/server";


export class GetAllFinanceiroController {
  async handle(req: NextRequest) {
    try {
      const result = await new GetAllFinanceiroUseCase().execute();
      const financeiroList = result.data || [];

      const produtosResult = await new GetAllProdutosUseCase().execute();
      const produtos = produtosResult.data || [];

      const pendentes = produtos.filter(
        (p: any) => p.status === "pendente"
      );

      const pendentesFormatados = pendentes.map((p: any) => ({
        id: p.id,
        produtoId: p.id,
        clienteNome: p.usuarioPendente || "Cliente não informado",
        valor: Number(p.preco) || 0,
        status: "Pendente",
        criadoEm: p.criadoEm,
        atualizadoEm: p.atualizadoEm,
      }));

      const financeiroComPendentes = [
        ...financeiroList,
        ...pendentesFormatados,
      ];

      return {
        status: true,
        code: 200,
        message:
          "Lançamentos financeiros (Pagos e Pendentes) obtidos com sucesso.",
        data: financeiroComPendentes,
      };
    } catch (error: any) {
      return {
        status: false,
        code: 500,
        message:
          error?.message || "Erro ao buscar lançamentos financeiros.",
        data: [],
      };
    }
  }
}