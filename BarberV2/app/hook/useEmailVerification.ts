// hook/useEmailVerification.ts
import { useState } from "react";
import { EmailVerificationService } from "../api/emailVerification";

const service = new EmailVerificationService();

type Notify = (msg: string, type?: any) => void;

interface UseEmailVerificationProps {
  email: string;
  onSuccess?: () => void;
}

export function useEmailVerification({
  email,
  onSuccess,
}: UseEmailVerificationProps) {
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [enviandoCodigo, setEnviandoCodigo] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [step, setStep] = useState<"email" | "verificacao">("email");

  // ✅ ENVIA O CÓDIGO + AGENDAMENTO (tudo junto)
  const enviarCodigo = async (notify?: Notify, agendamentoPayload?: any) => {
    if (!email?.trim()) {
      notify?.("Digite seu e-mail primeiro", "warning");
      return;
    }

    setEnviandoCodigo(true);

    try {
      const nome = email.split("@")[0];

      // Chama o serviço com o payload do agendamento
      const ok = await service.enviarCodigo(email, nome, agendamentoPayload);

      if (!ok) {
        notify?.("Não foi possível enviar o código", "error");
        return;
      }

      notify?.("Código enviado! Verifique seu e-mail.", "success");
      setCodigoEnviado(true);
      setStep("verificacao");
    } catch {
      notify?.("Erro ao enviar código", "error");
    } finally {
      setEnviandoCodigo(false);
    }
  };

  // ✅ VERIFICA O CÓDIGO (NÃO ENVIA AGENDAMENTO)
  const verificarCodigo = async (codigo: string, notify?: Notify) => {
    if (!codigo || codigo.length !== 6) {
      throw new Error("Digite o código de 6 dígitos");
    }

    setVerificando(true);

    try {
      const ok = await service.verificarCodigo(email, codigo);
      if (!ok) {
        throw new Error("Código incorreto ou expirado");
      }

      notify?.("E-mail verificado com sucesso!", "success");
      setEmailVerificado(true);
      onSuccess?.();
    } finally {
      setVerificando(false);
    }
  };

  const reset = () => {
    setCodigoEnviado(false);
    setCodigoDigitado("");
    setEmailVerificado(false);
    setStep("email");
  };

  return {
    step,
    codigoEnviado,
    codigoDigitado,
    enviandoCodigo,
    verificando,
    emailVerificado,
    setCodigoDigitado,
    setStep,
    enviarCodigo,
    verificarCodigo,
    reset,
  };
}