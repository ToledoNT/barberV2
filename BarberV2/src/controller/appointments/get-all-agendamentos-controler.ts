import { GetAllAppointmentsUseCase } from "../../use-case/agendamento/get-all-agendamento-use-case";

const getAllAppointmentsUseCase =
  new GetAllAppointmentsUseCase();

export class GetAllAppointmentsController {
  async handle() {
    const appointments =
      await getAllAppointmentsUseCase.execute();

    return appointments;
  }
}