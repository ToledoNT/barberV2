import { ResponseTemplateInterface } from "@/app/interfaces/response-templete-interface";
import { PrismaProdutoRepository } from "../../db/prisma/respositories/prisma-produtos-repository";
import { CreateLog } from "../logs/create-log";

export class GetAllProdutosUseCase {
  async execute(): Promise<ResponseTemplateInterface> {
    const responseGetAll = await new PrismaProdutoRepository().getAll();

    if (!responseGetAll.status) {
      await new CreateLog().execute(responseGetAll);
    }

    return responseGetAll;
  }
}