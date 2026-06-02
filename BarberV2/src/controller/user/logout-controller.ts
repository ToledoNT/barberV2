import { NextResponse } from "next/server";

export async function DELETE() {
  try {
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
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Erro no logout:", err);

    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Erro interno ao fazer logout",
        data: null,
      },
      { status: 500 }
    );
  }
}