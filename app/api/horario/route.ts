import { CreateHorarioIndividualController } from "@/controller/horarios/create-individual-horario";
import { DeleteHorarioController } from "@/controller/horarios/delete-horario-controller";
import { DeleteOldTimesController } from "@/controller/horarios/delete-horario-cron";
import { CreateHorarioController } from "@/controller/horarios/generate-horario-controller";
import { GetAllHorariosController } from "@/controller/horarios/get-all-horarios-controller";
import { GetHorariosByBarbeiroController } from "@/controller/horarios/get-by-barbeiros-controller";
import { UpdateHorarioController } from "@/controller/horarios/update-horario-controller";

import { UserRole } from "@/interface/user/create-user-interface";
import { HorarioMiddleware } from "@/middleware/horario-middleware";
import { UserMiddleware } from "@/middleware/user-middleware";
import { RouteHelper } from "app/helpers/auth-helper";
import { NextRequest } from "next/server";

const userMiddleware = new UserMiddleware();
const horarioMiddleware = new HorarioMiddleware();

const allowedRoles: UserRole[] = ["ADMIN", "BARBEIRO"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const auth = await RouteHelper.authAndRole(
      req,
      userMiddleware,
      allowedRoles
    );

    if (!auth.ok) {
      return auth.response;
    }

    const barbeiro = searchParams.get("barbeiro");

    if (barbeiro) {
      const controller = new GetHorariosByBarbeiroController();
      const response = await controller.handle(barbeiro);

      return RouteHelper.success(response, response.code ?? 200);
    }

    const controller = new GetAllHorariosController();
    const response = await controller.handle();

    return RouteHelper.success(response, response.code ?? 200);
  } catch (error) {
    console.error(error);
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

    const validation = horarioMiddleware.handleCreateHorario(body);

    if (!validation.status) {
      return RouteHelper.error(validation.message, validation.code);
    }

    if (body.data && body.inicio && body.fim) {
      const controller = new CreateHorarioIndividualController();
      const response = await controller.handle(body);

      return RouteHelper.success(response, response.code ?? 201);
    }

    const controller = new CreateHorarioController();
    const response = await controller.handle(body);

    return RouteHelper.success(response, response.code ?? 201);
  } catch (error) {
    console.error(error);
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

    const validation = horarioMiddleware.handleUpdateHorario({
      id,
      ...data,
    });

    if (!validation.status) {
      return RouteHelper.error(validation.message, validation.code);
    }

    const controller = new UpdateHorarioController();
    const response = await controller.handle({
      id,
      ...data,
    });

    return RouteHelper.success(response, response.code ?? 200);
  } catch (error) {
    console.error(error);
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

    const validation = horarioMiddleware.handleDeleteHorario({
      id,
    });

    if (!validation.status) {
      return RouteHelper.error(validation.message, validation.code);
    }

    const controller = new DeleteHorarioController();
    const response = await controller.handle(id);

    return RouteHelper.success(response, response.code ?? 200);
  } catch (error) {
    console.error(error);
    return RouteHelper.error("Erro interno", 500);
  }
}