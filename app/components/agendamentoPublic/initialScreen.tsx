"use client";

import Image from "next/image";
import { Scissors, Users } from "lucide-react";

interface InitialScreenProps {
  onAgendamentoClick: () => void;
  onGrupoClick: () => void;
}

export default function InitialScreen({
  onAgendamentoClick,
  onGrupoClick,
}: InitialScreenProps) {
  return (
    <div className="
      flex 
      flex-1 
      items-center 
      justify-center 
      px-6 
      py-10
      bg-gradient-to-br 
      from-stone-100 
      via-white 
      to-stone-200
    ">
      <div className="w-full max-w-md">

        <div className="
          bg-white/90
          backdrop-blur
          rounded-3xl
          shadow-2xl
          border
          border-stone-200
          p-8
          text-center
        ">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="
              relative
              w-28
              h-28
              rounded-full
              overflow-hidden
              border-4
              border-amber-500
              shadow-xl
              ring-4
              ring-amber-100
            ">
              <Image
                src="/kingsbarber2.png"
                alt="Kings Barber"
                fill
                sizes="112px"
                className="object-cover"
                priority
              />
            </div>
          </div>


          {/* Título */}
          <h1 className="
            text-4xl
            font-extrabold
            text-stone-900
            tracking-tight
          ">
            Kings Barber
          </h1>


          <p className="
            text-stone-500
            mt-3
            mb-8
            text-sm
            leading-relaxed
          ">
            Agende seu horário de forma rápida,
            simples e segura.
          </p>


          {/* Botões */}
          <div className="flex flex-col gap-4">

            <button
              type="button"
              onClick={onAgendamentoClick}
              className="
                group
                flex
                items-center
                justify-center
                gap-3
                w-full
                rounded-2xl
                bg-stone-900
                px-5
                py-4
                text-white
                font-semibold
                shadow-lg
                transition-all
                duration-200
                hover:bg-stone-800
                hover:-translate-y-0.5
                active:scale-95
              "
            >
              <Scissors 
                size={20}
                className="group-hover:rotate-12 transition"
              />

              Fazer agendamento
            </button>


            <button
              type="button"
              onClick={onGrupoClick}
              className="
                group
                flex
                items-center
                justify-center
                gap-3
                w-full
                rounded-2xl
                border-2
                border-stone-300
                bg-white
                px-5
                py-4
                text-stone-700
                font-semibold
                transition-all
                duration-200
                hover:border-amber-500
                hover:text-stone-900
                hover:bg-amber-50
                hover:-translate-y-0.5
                active:scale-95
              "
            >
              <Users 
                size={20}
                className="group-hover:scale-110 transition"
              />

              Agendamento em grupo
            </button>

          </div>


          <p className="
            mt-8
            text-xs
            text-stone-400
          ">
            © Kings Barber • Atendimento profissional
          </p>

        </div>

      </div>
    </div>
  );
}