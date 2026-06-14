"use client";

import {
  Mail,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Check,
  RefreshCw,
  Phone,
  Clock,
} from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";

interface Props {
  nome: string;
  email: string;
  onNomeChange: (nome: string) => void;
  onEmailChange: (email: string) => void;
  onEnviarCodigo: () => Promise<void>;

  onVerificarCodigo?: (codigo: string) => Promise<void>;

  onReenviarCodigo?: () => Promise<void>;
  onVoltar?: () => void;
  enviando: boolean;
  verificando?: boolean;
  reenviando?: boolean;
  disabled: boolean;
  codigo?: string;
  onCodigoChange?: (codigo: string) => void;
}

export function EmailVerification({
  nome,
  email,
  onNomeChange,
  onEmailChange,
  onEnviarCodigo,
  onVerificarCodigo,
  onReenviarCodigo,
  onVoltar,
  enviando,
  verificando = false,
  reenviando = false,
  disabled,
  codigo: codigoExterno,
  onCodigoChange: onCodigoChangeExterno,
}: Props) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [codigoInterno, setCodigoInterno] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [codigoError, setCodigoError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const codigo = codigoExterno ?? codigoInterno;
  const setCodigo = onCodigoChangeExterno ?? setCodigoInterno;

  const emailValido = useMemo(
    () => email.includes("@") && email.includes("."),
    [email]
  );
  const nomeValido = useMemo(() => nome.trim().length > 2, [nome]);
  const podeEnviar = emailValido && nomeValido;

  // Limpar intervalo ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Iniciar timer quando entrar na step "code" com tempo restante > 0
  useEffect(() => {
    if (step === "code" && timeLeft !== null && timeLeft > 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (step === "code" && timeLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [step, timeLeft]);

  function resetTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(300);
  }

  // Limpa erro quando o campo é editado
  function handleCodigoChange(value: string) {
    setCodigo(value.replace(/\D/g, ""));
    if (codigoError) setCodigoError(null);
  }

  async function handleEnviarCodigo() {
    try {
      await onEnviarCodigo();
      resetTimer();
      setStep("code");
      setCodigoError(null);
    } catch (error) {
      // Se o envio falhar, você pode tratar aqui ou repassar
      console.error("Erro ao enviar código:", error);
    }
  }

  async function handleVerificar() {
    if (!codigo || codigo.length < 6) return;
    setCodigoError(null); // limpa erro anterior
    try {
if (!onVerificarCodigo) return;

await onVerificarCodigo(codigo);      // Se chegou aqui, o código está correto – a navegação deve ser feita pelo pai
    } catch (error) {
      // Assumimos que o erro veio do backend (código inválido, expirado, etc.)
      setCodigoError(
        error instanceof Error
          ? error.message
          : "Código inválido ou expirado. Tente novamente."
      );
    }
  }

  async function handleReenviar() {
    if (timeLeft !== null && timeLeft > 0) return;
    setCodigoError(null); // limpa erro antes de reenviar
    try {
      if (onReenviarCodigo) {
        await onReenviarCodigo();
      } else {
        await onEnviarCodigo();
      }
      resetTimer();
    } catch (error) {
      console.error("Erro ao reenviar código:", error);
    }
  }

  function handleBackToEmail() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(null);
    setCodigoError(null);
    setStep("email");
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const canResend = timeLeft === 0;
  const resendButtonText = canResend
    ? "Reenviar código"
    : timeLeft !== null
    ? `Reenviar código (${formatTime(timeLeft)})`
    : "Reenviar código";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden transition-all duration-200">
      <div className="h-1.5 bg-gradient-to-r from-amber-500 to-amber-600" />

      <div className="p-6 md:p-8 space-y-6">
        {/* ================= EMAIL STEP ================= */}
        {step === "email" && (
          <div className="space-y-5">
            {onVoltar && (
              <button
                onClick={onVoltar}
                className="group flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
                Voltar
              </button>
            )}

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-stone-800">
                Verifique seu e-mail
              </h2>
              <p className="text-stone-500 text-sm">
                Enviaremos um código de acesso
              </p>
            </div>

            {email.length === 0 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>Informe um e‑mail válido para continuar</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700">
                Nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => onNomeChange(e.target.value)}
                placeholder="Como gostaria de ser chamado?"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleEnviarCodigo}
              disabled={disabled || enviando || !podeEnviar}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Enviando...
                </>
              ) : (
                "Enviar código de acesso"
              )}
            </button>

            <div className="mt-4 pt-3 border-t border-stone-100 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
                <Phone size={14} />
                <span>
                  Não tem e‑mail?{" "}
                  <strong className="text-amber-700">
                    Entre em contato com a barbearia
                  </strong>{" "}
                  para realizar o agendamento.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= CODE STEP ================= */}
        {step === "code" && (
          <div className="space-y-5">
            <button
              onClick={handleBackToEmail}
              className="group flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Voltar
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-stone-800">
                Código enviado
              </h2>
              <p className="text-stone-500 text-sm">
                Digite o código de 6 dígitos que enviamos para{" "}
                <span className="font-medium text-stone-700">{email}</span>
              </p>
              {timeLeft !== null && timeLeft > 0 && (
                <div className="flex items-center justify-center gap-1.5 mt-2 text-sm text-amber-600">
                  <Clock size={14} />
                  <span>O código expira em {formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            {/* Campo do código OTP */}
            <div>
              <input
                value={codigo}
                onChange={(e) => handleCodigoChange(e.target.value)}
                maxLength={6}
                placeholder="000000"
                className={`w-full text-center text-2xl tracking-[0.5em] font-mono border rounded-xl py-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all ${
                  codigoError
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/30"
                    : "border-stone-200"
                }`}
              />
              {codigoError && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{codigoError}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleVerificar}
              disabled={disabled || verificando || codigo.length < 6}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verificando ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verificando...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Verificar código
                </>
              )}
            </button>

            <button
              onClick={handleReenviar}
              disabled={!canResend || reenviando}
              className="text-sm flex items-center justify-center gap-1.5 mx-auto text-stone-500 hover:text-amber-700 transition-colors disabled:opacity-50 disabled:hover:text-stone-500"
            >
              {reenviando ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Reenviando...
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  {resendButtonText}
                </>
              )}
            </button>

            <div className="pt-2 border-t border-stone-100 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
                <Phone size={12} />
                <span>
                  Sem e‑mail? Contate a barbearia para agendar diretamente.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}