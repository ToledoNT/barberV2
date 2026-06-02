import { NextRequest } from "next/server";

import { GetAllProcedimentosController } from "@/src/controller/procedimentos/get-all-procedimento-controller";
import { CreateProcedimentoController } from "@/src/controller/procedimentos/create-procedimento-controller";
import { UpdateProcedimentoController } from "@/src/controller/procedimentos/update-procedimento-controller";
import { DeleteProcedimentoController } from "@/src/controller/procedimentos/delete-procedimento-controller";


import { UserRole } from "../../../../../KingsBarberShopBackend/src/interface/user/create-user-interface";
import { RouteHelper } from "@/app/helpers/auth-helper";
import { UserMiddleware } from "@/src/middleware/user-middleware";
import { ProcedimentoMiddleware } from "@/src/middleware/procedimento-middleware";

const userMiddleware = new UserMiddleware();
const procedimentoMiddleware = new ProcedimentoMiddleware();

const allowedRoles: UserRole[] = ["ADMIN", "BARBEIRO"];

export async function GET(req: NextRequest) {
  try {
    const auth = await RouteHelper.authAndRole(req, userMiddleware, allowedRoles);

    if (!auth.ok) return auth.response;

    const controller = new GetAllProcedimentosController();
    const response = await controller.handle();

    return RouteHelper.success(response, response.code ?? 200);
  } catch {
    return RouteHelper.error("Erro interno", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await RouteHelper.authAndRole(req, userMiddleware, allowedRoles);

    if (!auth.ok) return auth.response;

    const validation =
      await procedimentoMiddleware.handleCreateProcedimento(req);

    if (!validation.status) {
      return RouteHelper.error(validation.message, validation.code);
    }

    const data = validation.data;

    if (!data) {
      return RouteHelper.error("Dados inválidos", 400);
    }

    const controller = new CreateProcedimentoController();
    const response = await controller.handle(data);

    return RouteHelper.success(response, response.code ?? 201);
  } catch {
    return RouteHelper.error("Erro interno", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await RouteHelper.authAndRole(
      req,
      userMiddleware,
      allowedRoles
    );

    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } =
      new URL(req.url);

    const id =
      searchParams.get("id");

    if (!id) {
      return RouteHelper.error(
        "ID é obrigatório",
        400
      );
    }

    const validation =
      await procedimentoMiddleware
        .handleUpdateProcedimento(req);

    if (!validation.status) {
      return RouteHelper.error(
        validation.message,
        validation.code ?? 400
      );
    }

    const data = validation.data;

    if (
      !data ||
      Array.isArray(data)
    ) {
      return RouteHelper.error(
        "Dados inválidos",
        400
      );
    }

    const { id: _, ...rest } = data;

    const controller =
      new UpdateProcedimentoController();

    const response =
      await controller.handle({
        id,
        ...rest,
      });

    return RouteHelper.success(
      response,
      response.code ?? 200
    );
  } catch (error) {
    console.error(error);

    return RouteHelper.error(
      "Erro interno",
      500
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await RouteHelper.authAndRole(req, userMiddleware, allowedRoles);

    if (!auth.ok) return auth.response;

    const validation =
      await procedimentoMiddleware.handleDeleteProcedimento(req);

    if (!validation.status) {
      return RouteHelper.error(validation.message, validation.code);
    }

    const id = validation.id;

    if (!id) {
      return RouteHelper.error("ID inválido", 400);
    }

    const controller = new DeleteProcedimentoController();
    const response = await controller.handle(id);

    return RouteHelper.success(response, response.code ?? 200);
  } catch {
    return RouteHelper.error("Erro interno", 500);
  }
}