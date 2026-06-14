import { CreateProdutoController } from "@/controller/produtos/create-produto-controller";
import { DeleteProdutoController } from "@/controller/produtos/delete-produtos-controller";
import { GetAllProdutosController } from "@/controller/produtos/get-all-produto-controller";
import { GetProdutoByIdController } from "@/controller/produtos/get-produto-bby-id-controller";
import { UpdateProdutoController } from "@/controller/produtos/update-produto-controller";
import { NextRequest, NextResponse } from "next/server";

const createController = new CreateProdutoController();
const updateController = new UpdateProdutoController();
const deleteController = new DeleteProdutoController();
const getAllController = new GetAllProdutosController();
const getByIdController = new GetProdutoByIdController();

// ============================
// GET (ALL / BY ID)
// ============================
export async function GET(req: NextRequest) {
  try {
    const result = await getAllController.handle(req);

    return result;
  } catch (err: any) {
    return NextResponse.json(
      { status: false, message: err.message || "Erro ao buscar produto(s)" },
      { status: 500 }
    );
  }
}

// ============================
// POST (CREATE)
// ============================
export async function POST(req: NextRequest) {
  try {
    return await createController.handle(req);
  } catch (err: any) {
    return NextResponse.json(
      { status: false, message: err.message || "Erro ao criar produto" },
      { status: 500 }
    );
  }
}

// ============================
// PUT (UPDATE)
// ============================
export async function PUT(req: NextRequest) {
  try {
    return await updateController.handle(req);
  } catch (err: any) {
    return NextResponse.json(
      { status: false, message: err.message || "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

// ============================
// DELETE
// ============================
export async function DELETE(req: NextRequest) {
  try {
    return await deleteController.handle(req);
  } catch (err: any) {
    return NextResponse.json(
      { status: false, message: err.message || "Erro ao deletar produto" },
      { status: 500 }
    );
  }
}