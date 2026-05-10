import { useState } from "react";
import { UseEmailVerificationProps } from "../interfaces/emailInterface";
import { EmailVerificationService } from "../api/emailVerification";

const service = new EmailVerificationService();

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

  const enviarCodigo = async (notify: (msg: string, type: any) => void) => {
  if (!email.trim()) {
    notify("Digite seu e-mail primeiro", "warning");
    return false;
  }

  setEnviandoCodigo(true);
  try {
    const nome = email.split("@")[0]; // fallback simples

    const ok = await service.enviarCodigo(email, nome);

    if (!ok) throw new Error();

    notify("Código enviado! Verifique seu e-mail.", "success");
    setCodigoEnviado(true);
    setStep("verificacao");
    return true;
  } catch {
    notify("Não foi possível enviar o código. Tente novamente.", "error");
    return false;
  } finally {
    setEnviandoCodigo(false);
  }
};

  const verificarCodigo = async (notify: (msg: string, type: any) => void) => {
    if (codigoDigitado.length !== 6) {
      notify("Digite o código de 6 dígitos", "warning");
      return false;
    }

    setVerificando(true);
    try {
      const ok = await service.verificarCodigo(email, codigoDigitado);

      if (!ok) throw new Error();

      notify("E-mail verificado com sucesso!", "success");
      setEmailVerificado(true);
      onSuccess?.();
      return true;
    } catch {
      notify("Código incorreto ou expirado. Tente novamente.", "error");
      return false;
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