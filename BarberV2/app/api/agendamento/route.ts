import { NextRequest } from "next/server";

import { CreateAppointmentController } from "@/app/controller/appointments/create-agendamento-controller";
import { GetAllAppointmentsController } from "@/app/controller/appointments/get-all-agendamentos-controler";
import { UpdateAppointmentController } from "@/app/controller/appointments/update-agendamento-controller";
import { DeleteAppointmentController } from "@/app/controller/appointments/delete-agendamento-controller";
import { GetHorariosByBarbeiroController } from "@/app/controller/horarios/get-by-barbeiros-controller";

import { AppointmentMiddleware } from "@/app/middleware/agendamento-middleware";
import { UserMiddleware } from "@/app/middleware/user-middleware";


import { UserRole } from "../../../../../KingsBarberShopBackend/src/interface/user/create-user-interface";
import { RouteHelper } from "@/app/helpers/auth-helper";

const appointmentMiddleware = new AppointmentMiddleware();
const userMiddleware = new UserMiddleware();

const allowedRoles: UserRole[] = ["ADMIN", "BARBEIRO"];

export async function GET(req: NextRequest) {
  try {
    const auth = await RouteHelper.authAndRole(
      req,
      userMiddleware,
      allowedRoles
    );

    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);

    const barbeiro = searchParams.get("barbeiro");
    const data = searchParams.get("data");

    if (barbeiro && data) {
      const controller = new GetHorariosByBarbeiroController();
      const response = await controller.handle(barbeiro, data);

      return RouteHelper.success(response, response.code ?? 200);
    }

    const controller = new GetAllAppointmentsController();
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
      appointmentMiddleware.handleCreateAppointment(body);

    if (!validation.status) {
      return RouteHelper.error(
        validation.message,
        validation.code
      );
    }

    const controller = new CreateAppointmentController();
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
      return RouteHelper.error("ID obrigatório", 400);
    }

    const controller = new UpdateAppointmentController();
    const response = await controller.handle({ id, ...data });

    return RouteHelper.success(response, response.code ?? 200);
  } catch {
    return RouteHelper.error("Erro interno", 500);
  }
}
