"use client";

import { CheckCircle2, Sparkles } from "lucide-react";

interface SuccessScreenProps {
  onClose?: () => void;
  onNewBooking?: () => void;  // opcional, já que não é usado
}
export function SuccessScreen({ onClose }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fade-in-up">
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Faixa decorativa superior - agora âmbar */}
          <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600" />

          <div className="p-8 text-center space-y-6">
            {/* Ícone de sucesso animado - âmbar */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-amber-500 to-amber-600 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="text-white w-12 h-12" />
                </div>
              </div>
            </div>

            {/* Título e mensagem */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-stone-800">
                Agendamento concluído!
              </h2>
              <p className="text-stone-500">
                Seu agendamento foi registrado com sucesso.
              </p>
            </div>

            {/* Mensagem adicional - mantendo âmbar */}
            <div className="flex items-center justify-center gap-2 text-amber-700 bg-amber-50 rounded-xl p-3">
              <Sparkles size={16} />
              <span className="text-sm">
                Enviamos a confirmação para seu e‑mail.
              </span>
            </div>

            {/* Botão único: Fechar */}
            {onClose && (
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold py-2.5 rounded-xl shadow-md transition-all"
              >
                Fechar
              </button>
            )}
          </div>
        </div>

        {/* Efeito de brilho sutil no fundo - cores âmbar */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>
      </div>
    </div>
  );
}