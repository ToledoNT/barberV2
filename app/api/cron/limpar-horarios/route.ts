import { DeleteOldTimesController } from "@/controller/horarios/delete-horario-cron";

export async function GET() {
  const controller = new DeleteOldTimesController();
  const response = await controller.handle();

  return Response.json(response);
}