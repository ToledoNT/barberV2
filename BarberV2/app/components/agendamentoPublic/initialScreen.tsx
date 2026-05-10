"use client";

import Image from "next/image";

interface InitialScreenProps {
  onAgendamentoClick: () => void;
  onGrupoClick: () => void;
}

export default function InitialScreen({
  onAgendamentoClick,
  onGrupoClick,
}: InitialScreenProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg">
              <Image
                src="/kingsbarber2.png"
                alt="Kings Barber"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">
            Kings Barber
          </h1>

          <p className="text-stone-500 mt-3 mb-8 text-sm">
            Escolha como deseja realizar seu atendimento
          </p>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={onAgendamentoClick}
              className="w-full rounded-2xl bg-stone-900 px-5 py-4 text-white font-semibold transition-all duration-200 hover:bg-stone-800 hover:scale-[1.01] active:scale-[0.99] shadow-md"
            >
              Fazer agendamento
            </button>

            <button
              type="button"
              onClick={onGrupoClick}
              className="w-full rounded-2xl border-2 border-stone-300 bg-white px-5 py-4 text-stone-700 font-semibold transition-all duration-200 hover:border-stone-400 hover:bg-stone-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              Agendamento em grupo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}