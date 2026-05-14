import { NextRequest } from "next/server";

import { CreateHorarioController } from "@/app/controller/horarios/generate-horario-controller";

import { GetAllHorariosController } from "@/app/controller/horarios/get-all-horarios-controller";
import { UpdateHorarioController } from "@/app/controller/horarios/update-horario-controller";
import { DeleteHorarioController } from "@/app/controller/horarios/delete-horario-controller";
import { GetHorariosByBarbeiroController } from "@/app/controller/horarios/get-by-barbeiros-controller";

import { UserMiddleware } from "@/app/middleware/user-middleware";
import { HorarioMiddleware } from "@/app/middleware/horario-middleware";

import { UserRole } from "../../../../../KingsBarberShopBackend/src/interface/user/create-user-interface";

import { RouteHelper } from "@/app/helpers/auth-helper";
import { CreateHorarioIndividualController } from "@/app/controller/horarios/create-individual-horario";

const userMiddleware = new UserMiddleware();
const horarioMiddleware = new HorarioMiddleware();

const allowedRoles: UserRole[] = [
  "ADMIN",
  "BARBEIRO",
];

export async function GET(req: NextRequest) {
  try {
    const auth = await RouteHelper.authAndRole(
      req,
      userMiddleware,
      allowedRoles
    );

    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);

    const barbeiro =
      searchParams.get("barbeiro");

    if (barbeiro) {
      const controller =
        new GetHorariosByBarbeiroController();

      const response =
        await controller.handle(barbeiro);

      return RouteHelper.success(
        response,
        response.code ?? 200
      );
    }

    const controller =
      new GetAllHorariosController();

    const response =
      await controller.handle();

    return RouteHelper.success(
      response,
      response.code ?? 200
    );
  } catch {
    return RouteHelper.error(
      "Erro interno",
      500
    );
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
      return RouteHelper.error(
        "Body inválido",
        400
      );
    }

    const validation =
      horarioMiddleware.handleCreateHorario(
        body
      );

    if (!validation.status) {
      return RouteHelper.error(
        validation.message,
        validation.code
      );
    }

    if (
      body.data &&
      body.inicio &&
      body.fim
    ) {
      const controller =
        new CreateHorarioIndividualController();

      const response =
        await controller.handle(body);

      return RouteHelper.success(
        response,
        response.code ?? 201
      );
    }

    const controller =
      new CreateHorarioController();

    const response =
      await controller.handle(body);

    return RouteHelper.success(
      response,
      response.code ?? 201
    );
  } catch (error) {
    console.error(error);

    return RouteHelper.error(
      "Erro interno",
      500
    );
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
      return RouteHelper.error(
        "Body inválido",
        400
      );
    }

    const { id, ...data } = body;

    if (!id) {
      return RouteHelper.error(
        "ID é obrigatório",
        400
      );
    }

    const validation =
      horarioMiddleware.handleUpdateHorario({
        id,
        ...data,
      });

    if (!validation.status) {
      return RouteHelper.error(
        validation.message,
        validation.code
      );
    }

    const controller =
      new UpdateHorarioController();

    const response =
      await controller.handle({
        id,
        ...data,
      });

    return RouteHelper.success(
      response,
      response.code ?? 200
    );
  } catch {
    return RouteHelper.error(
      "Erro interno",
      500
    );
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
      return RouteHelper.error(
        "ID é obrigatório",
        400
      );
    }

    const validation =
      horarioMiddleware.handleDeleteHorario({
        id,
      });

    if (!validation.status) {
      return RouteHelper.error(
        validation.message,
        validation.code
      );
    }

    const controller =
      new DeleteHorarioController();

    const response =
      await controller.handle(id);

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