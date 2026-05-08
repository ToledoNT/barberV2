import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { CreateUser } from "@/app/use-case/user/create-use-case";
import { ICreateUser } from "../../../../../KingsBarberShopBackend/src/interface/user/create-user-interface";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "The fields 'name', 'email' and 'password' are required.",
          data: [],
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload: ICreateUser = new CreateUserModel({
      name,
      email,
      password: hashedPassword,
    }).toPayload();

    const createdUserResult = await new CreateUser().execute(payload);

    return NextResponse.json(createdUserResult, {
      status: createdUserResult.code ?? 201,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Erro interno ao criar usuário",
        data: null,
      },
      { status: 500 }
    );
  }
}