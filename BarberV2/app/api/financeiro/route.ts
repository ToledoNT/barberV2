import { NextRequest, NextResponse } from "next/server";

import { GetAllFinanceiroController } from "@/src/controller/financeiro/get-all-financeiro-controller";
import { UserMiddleware } from "@/src/middleware/user-middleware";

const userMiddleware = new UserMiddleware();
const getAllFinanceiroController = new GetAllFinanceiroController();

export async function GET(req: NextRequest) {
  try {
    const authResponse = await userMiddleware.handleAuth(req);

    if (!authResponse.status || !authResponse.user) {
      return NextResponse.json(authResponse, {
        status: authResponse.code || 401,
      });
    }

    const user = authResponse.user;

    // ROLE
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          status: false,
          code: 403,
          message:
            "Acesso negado: apenas administradores podem acessar o financeiro.",
          data: [],
        },
        {
          status: 403,
        }
      );
    }

    // CONTROLLER
    const response = await getAllFinanceiroController.handle(req);

    return NextResponse.json(response, {
      status: response.code || 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: error?.message || "Erro interno do servidor",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}