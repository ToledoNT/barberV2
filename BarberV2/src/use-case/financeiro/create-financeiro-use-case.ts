import { ICreateFinanceiro } from "../../../../../KingsBarberShopBackend/src/interface/financeiro/create-financeiro-interface";
import { PrismaFinanceiroRepository } from "../../db/prisma/respositories/prisma-financeiro-repository";
import { CreateLog } from "../logs/create-log";

export class CreateFinanceiroUseCase {
  async execute(data: ICreateFinanceiro) {
    const repository = new PrismaFinanceiroRepository();
    const response = await repository.create(data);

    if (response.status) {
      return response.data;
    } else {
      console.error("Erro ao criar lançamento financeiro:", response.error);

      await new CreateLog().execute(response);

      return null;
    }
  }
}