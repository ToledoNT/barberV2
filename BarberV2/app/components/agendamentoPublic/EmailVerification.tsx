import {
  Mail,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Check,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface Props {
  nome: string;
  email: string;
  onNomeChange: (nome: string) => void;
  onEmailChange: (email: string) => void;

  onEnviarCodigo: () => Promise<void>;
  onVerificarCodigo: (codigo: string) => Promise<void>;
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

  const codigo =
    codigoExterno !== undefined ? codigoExterno : codigoInterno;

  const onCodigoChange =
    onCodigoChangeExterno || setCodigoInterno;

  const emailValido = email.includes("@") && email.includes(".");
  const nomeValido = nome.trim().length > 2;
  const podeEnviar = emailValido && nomeValido;
  const codigoPreenchido = codigo.trim().length > 0;

  // ✅ ENVIAR CÓDIGO
  const handleEnviarCodigo = async () => {
    await onEnviarCodigo();
    setStep("code");
  };

  // ✅ VERIFICAR CÓDIGO (CORRIGIDO)
  const handleVerificar = async () => {
    if (!codigoPreenchido) return;
    await onVerificarCodigo(codigo);
  };

  // ✅ REENVIAR
  const handleReenviar = async () => {
    if (onReenviarCodigo) {
      await onReenviarCodigo();
    } else {
      await onEnviarCodigo();
    }
  };

  const EmailForm = () => (
    <>
      {onVoltar && (
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 text-sm text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl w-fit"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      )}

      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold text-stone-900">
          Confirmar e-mail para efetuar o agendamento
        </h2>
        <p className="text-xs text-stone-500">
          Seus dados são usados apenas para confirmação do agendamento
        </p>
      </div>

      {email.length === 0 && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs">
          <AlertCircle size={16} className="mt-0.5" />
          Não possui e-mail? Entre em contato diretamente.
        </div>
      )}

      <input
        type="text"
        placeholder="Nome completo"
        value={nome}
        onChange={(e) => onNomeChange(e.target.value)}
        className="w-full px-4 py-2.5 border rounded-xl"
      />

      <div className="relative">
        <Mail size={18} className="absolute left-3 top-3 text-stone-400" />
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl"
        />
      </div>

      <button
        onClick={handleEnviarCodigo}
        disabled={disabled || enviando || !podeEnviar}
        className="w-full bg-amber-600 text-white py-2.5 rounded-xl"
      >
        {enviando ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          "Enviar código"
        )}
      </button>
    </>
  );

  const CodeVerification = () => (
    <>
      <button
        onClick={() => setStep("email")}
        className="flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={16} />
        Editar e-mail
      </button>

      <div className="text-center">
        <h2 className="text-lg font-semibold">Digite o código</h2>
        <p className="text-xs text-stone-500">
          Enviamos para <strong>{email}</strong>
        </p>
      </div>

      <input
        type="text"
        value={codigo}
        onChange={(e) => onCodigoChange(e.target.value)}
        maxLength={6}
        className="w-full text-center tracking-widest border rounded-xl py-2.5"
      />

      <button
        onClick={handleVerificar}
        disabled={disabled || verificando || !codigoPreenchido}
        className="w-full bg-amber-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2"
      >
        {verificando ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Check size={18} />
        )}
        Verificar código
      </button>

      <button
        onClick={handleReenviar}
        disabled={reenviando}
        className="text-xs flex items-center gap-1 mx-auto"
      >
        {reenviando ? (
          <Loader2 className="animate-spin" />
        ) : (
          <RefreshCw size={14} />
        )}
        Reenviar código
      </button>
    </>
  );

  return (
    <div className="bg-white p-6 rounded-2xl space-y-5">
      {step === "email" ? <EmailForm /> : <CodeVerification />}
    </div>
  );
}