import { NextRequest } from "next/server";

import { GetAllProfessionalsController } from "@/app/controller/profissional/get-all-profissional-controler";
import { CreateProfessionalController } from "@/app/controller/profissional/create-profissional-controller";
import { UpdateProfessionalController } from "@/app/controller/profissional/update-profissional-controller";
import { DeleteProfessionalController } from "@/app/controller/profissional/delete-profissional-controller";
import { GetHorariosByBarbeiroController } from "@/app/controller/horarios/get-by-barbeiros-controller";

import { UserMiddleware } from "@/app/middleware/user-middleware";
import { ProfessionalMiddleware } from "@/app/middleware/profissional-middleware";


import { UserRole } from "../../../../../KingsBarberShopBackend/src/interface/user/create-user-interface";
import { RouteHelper } from "@/app/helpers/auth-helper";

const userMiddleware = new UserMiddleware();
const professionalMiddleware = new ProfessionalMiddleware();

const allowedRoles: UserRole[] = ["ADMIN", "BARBEIRO"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const barbeiroId = searchParams.get("barbeiroId");

    if (barbeiroId) {
      const controller = new GetHorariosByBarbeiroController();
      const response = await controller.handle(barbeiroId);

      return RouteHelper.success(response, response.code ?? 200);
    }

    const controller = new GetAllProfessionalsController();
    const response = await controller.handle();

    return RouteHelper.success(response, response.code ?? 200);
  } catch {
    return RouteHelper.error("Erro interno", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await RouteHelper.authAndRole(
      req,
      userMiddleware,
      allowedRoles
    );

    if (!auth.ok) return auth.response;

    const body = await RouteHelper.getBody(req);

    if (!body) {
      return RouteHelper.error("Body inválido", 400);
    }

    const validation =
      await professionalMiddleware.handleCreateProfessional(req);

    if (!validation.status) {
      return RouteHelper.error(
        validation.message,
        validation.code
      );
    }

    const controller = new CreateProfessionalController();
    const response = await controller.handle(body);

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

    if (!auth.ok) return auth.response;

    const body = await RouteHelper.getBody(req);

    if (!body) {
      return RouteHelper.error("Body inválido", 400);
    }

    const { id, ...data } = body;

    if (!id) {
      return RouteHelper.error("ID é obrigatório", 400);
    }

    const validation =
      await professionalMiddleware.handleUpdateProfessional(req);

    if (!validation.status) {
      return RouteHelper.error(
        validation.message,
        validation.code
      );
    }

    const controller = new UpdateProfessionalController();
    const response = await controller.handle({ id, ...data });

    return RouteHelper.success(response, response.code ?? 200);
  } catch {
    return RouteHelper.error("Erro interno", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await RouteHelper.authAndRole(
      req,
      userMiddleware,
      allowedRoles
    );

    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return RouteHelper.error("ID é obrigatório", 400);
    }

    const validation =
      await professionalMiddleware.handleDeleteProfessional(req);

    if (!validation.status) {
      return RouteHelper.error(
        validation.message,
        validation.code
      );
    }

    const controller = new DeleteProfessionalController();
    const response = await controller.handle(id);

    return RouteHelper.success(response, response.code ?? 200);
  } catch {
    return RouteHelper.error("Erro interno", 500);
  }
}