import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GetUserByEmailUseCase } from "@/app/use-case/user/get-user-by-email-use-case";


/**
 * =========================
 * POST - LOGIN
 * =========================
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "email e password são obrigatórios",
          data: null,
        },
        { status: 400 }
      );
    }

    const userResult = await new GetUserByEmailUseCase().execute(email);

    if (!userResult.status || !userResult.data) {
      return NextResponse.json(
        {
          status: false,
          code: 401,
          message: "Usuário ou senha inválidos",
          data: null,
        },
        { status: 401 }
      );
    }

    const user = userResult.data;

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        {
          status: false,
          code: 401,
          message: "Usuário ou senha inválidos",
          data: null,
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "10h" }
    );

    const response = NextResponse.json({
      status: true,
      code: 200,
      message: "Login realizado com sucesso",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 10,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Erro interno ao fazer login",
        data: null,
      },
      { status: 500 }
    );
  }
}

/**
 * =========================
 * GET - VERIFY TOKEN
 * =========================
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          status: false,
          code: 401,
          message: "Token inválido ou expirado",
          data: null,
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

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
        message: "Token inválido ou expirado",
        data: null,
      },
      { status: 401 }
    );
  }
}

/**
 * =========================
 * DELETE - LOGOUT
 * =========================
 */
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
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  return response;
}