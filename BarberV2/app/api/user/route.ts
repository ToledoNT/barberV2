import { NextRequest, NextResponse } from "next/server";
import { LoginController } from "@/app/controller/user/login-controller";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const controller = new LoginController();
    const result = await controller.handle(email, password);

    if (!result.status) {
      return NextResponse.json(result, {
        status: result.code ?? 400,
      });
    }

    const { user, token } = result.data!;

    const response = NextResponse.json(
      {
        status: true,
        code: 200,
        message: result.message,
        data: result.data, 
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 10,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Erro interno",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          status: false,
          code: 401,
          message: "Token não encontrado",
          data: null,
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    return NextResponse.json({
      status: true,
      code: 200,
      message: "Token válido",
      data: decoded,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: false,
        code: 401,
        message: "Token inválido",
        data: null,
      },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    status: true,
    code: 200,
    message: "Logout realizado com sucesso",
    data: null,
  });

  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return response;
}