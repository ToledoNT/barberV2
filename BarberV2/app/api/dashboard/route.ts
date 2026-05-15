import { NextRequest, NextResponse } from "next/server";

import { UserMiddleware } from "@/app/middleware/user-middleware";
import { GetDashboardMetricsController } from "@/app/controller/dashboard/dashbaord-controller";

const userMiddleware = new UserMiddleware();
const getDashboardController = new GetDashboardMetricsController();

/* ============================
   ✅ DASHBOARD METRICS (ADMIN)
   ============================ */
export async function GET(req: NextRequest) {
  try {
    // AUTH
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
            "Acesso negado: apenas administradores podem acessar o dashboard.",
          data: [],
        },
        {
          status: 403,
        }
      );
    }

    // CONTROLLER
    const response = await getDashboardController.handle(req);

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