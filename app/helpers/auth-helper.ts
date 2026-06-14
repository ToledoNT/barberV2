import { NextRequest, NextResponse } from "next/server";

type AuthResult<T = any> = {
  ok: boolean;
  user?: T;
  response?: NextResponse;
};

export class RouteHelper {
  static async authAndRole(
    req: NextRequest,
    userMiddleware: any,
    allowedRoles: string[]
  ): Promise<AuthResult> {
    const auth = await userMiddleware.handleAuth(req);

    if (!auth?.status || !auth?.user) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            status: false,
            code: 401,
            message: "Não autenticado",
            data: null,
          },
          { status: 401 }
        ),
      };
    }

    const roleCheck = userMiddleware.authorizeRoles(
      auth.user,
      ...allowedRoles
    );

    if (!roleCheck?.status) {
      return {
        ok: false,
        response: NextResponse.json(roleCheck, {
          status: roleCheck.code ?? 403,
        }),
      };
    }

    return {
      ok: true,
      user: auth.user,
    };
  }

  static async getBody<T = any>(req: NextRequest): Promise<T | null> {
    try {
      const json = await req.json();

      if (!json || typeof json !== "object") {
        return null;
      }

      return json as T;
    } catch {
      return null;
    }
  }

  static error(
    message = "Erro interno",
    code = 500,
    data: any = null
  ) {
    return NextResponse.json(
      {
        status: false,
        code,
        message,
        data,
      },
      { status: code }
    );
  }

  static success(data: any, code = 200) {
    return NextResponse.json(data, {
      status: code,
    });
  }
}