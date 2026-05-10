import { Loader2 } from "lucide-react";

interface Props {
  email: string;
  codigo: string;
  onCodigoChange: (codigo: string) => void;
  onVerificar: () => void;
  onCorrigirEmail: () => void;
  verificando: boolean;
}
export function CodeVerification({ email, codigo, onCodigoChange, onVerificar, onCorrigirEmail, verificando }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm animate-fade-in">
      <p className="text-sm text-stone-600">
        Enviamos um código para <strong>{email}</strong>
      </p>
      <div className="relative">
        <input
          type="text"
          placeholder="Código de 6 dígitos"
          value={codigo}
          onChange={(e) => onCodigoChange(e.target.value)}
          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-center text-xl tracking-widest text-stone-800"
          maxLength={6}
        />
      </div>
      <button
        onClick={onVerificar}
        disabled={codigo.length !== 6 || verificando}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-xl transition-all disabled:opacity-50"
      >
        {verificando ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Verificar código"}
      </button>
      <button onClick={onCorrigirEmail} className="w-full text-stone-500 text-sm underline mt-2">
        Corrigir e-mail
      </button>
    </div>
  )
}