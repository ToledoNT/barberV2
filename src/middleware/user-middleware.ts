import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";
import { UserRole } from "../interface/user/create-user-interface";

export class UserMiddleware {
  private attempts = new Map<string, { count: number; time: number }>();

  loginLimiter(ip: string) {
    const now = Date.now();
    const limit = 5;
    const windowMs = 15 * 60 * 1000;

    const record = this.attempts.get(ip);

    if (!record) {
      this.attempts.set(ip, { count: 1, time: now });
      return { status: true };
    }

    const isExpired = now - record.time > windowMs;

    if (isExpired) {
      this.attempts.set(ip, { count: 1, time: now });
      return { status: true };
    }

    if (record.count >= limit) {
      return {
        status: false,
        code: 429,
        message: "Muitas tentativas de login. Tente novamente mais tarde.",
      };
    }

    record.count += 1;
    this.attempts.set(ip, record);

    return { status: true };
  }

  async handleAuth(req: NextRequest) {
    try {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return {
          status: false,
          code: 401,
          message: "Token não fornecido",
          data: null,
        };
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtPayload;

      if (!decoded || !decoded.id || !decoded.role) {
        return {
          status: false,
          code: 401,
          message: "Token inválido ou incompleto",
          data: null,
        };
      }

      return {
        status: true,
        user: decoded,
      };

    } catch (err) {
      return {
        status: false,
        code: 401,
        message: "Token inválido ou expirado",
        data: null,
      };
    }
  }

  authorizeRoles(user: any, ...roles: UserRole[]) {
    if (!user) {
      return {
        status: false,
        code: 401,
        message: "Token não fornecido.",
      };
    }

    const role = String(user.role).toUpperCase() as UserRole;

    if (!roles.includes(role)) {
      return {
        status: false,
        code: 403,
        message: "Acesso negado.",
      };
    }

    return { status: true };
  }

  async handleLogout() {
    return {
      status: true,
      code: 200,
      message: "Logout realizado com sucesso",
      data: null,
    };
  }
}