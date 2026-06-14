export interface ICreateEmailVerification {
  email: string;
  nome: string;
  code: string;
  expiresAt: Date;
  attempts?: number;
  tipo: "email" | "sms" | "whatsapp";
  payload?: Record<string, any>;
}