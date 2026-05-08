import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
    console.error("Erro ao verificar token:", err);

    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Erro interno ao verificar token",
        data: null,
      },
      { status: 500 }
    );
  }
}