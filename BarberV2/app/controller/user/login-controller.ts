import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GetUserByEmailUseCase } from "@/app/use-case/user/get-user-by-email-use-case";

export class LoginController {
  async handle(email: string, password: string) {
    if (!email || !password) {
      return {
        status: false,
        code: 400,
        message: "email e password são obrigatórios",
        data: null,
      };
    }

    const userResult = await new GetUserByEmailUseCase().execute(email);

    if (!userResult.status || !userResult.data) {
      return {
        status: false,
        code: 401,
        message: "Usuário ou senha inválidos",
        data: null,
      };
    }

    const user = userResult.data;

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        status: false,
        code: 401,
        message: "Usuário ou senha inválidos",
        data: null,
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "10h" }
    );

    return {
      status: true,
      code: 200,
      message: "Login realizado com sucesso",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    };
  }
}