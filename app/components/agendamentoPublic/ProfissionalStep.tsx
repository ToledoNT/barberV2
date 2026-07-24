"use client";

import React, { useState } from "react";
import {
  User,
  ChevronRight,
  Check,
  Star,
  Scissors,
} from "lucide-react";

interface Profissional {
  id: string;
  nome: string;
  especialidade?: string;
  avaliacao?: number;
}

interface ProfessionalsStepProps {
  profissionais: Profissional[];
  onSelect: (profissional: Profissional) => void;
}

export function ProfessionalsStep({
  profissionais,
  onSelect,
}: ProfessionalsStepProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);


  if (!profissionais?.length) {
    return (
      <div className="
        flex
        flex-col
        items-center
        justify-center
        py-16
        text-center
      ">
        <div className="
          w-20
          h-20
          rounded-full
          bg-stone-100
          flex
          items-center
          justify-center
          mb-4
        ">
          <User
            size={32}
            className="text-stone-400"
          />
        </div>

        <h3 className="
          text-lg
          font-semibold
          text-stone-700
        ">
          Nenhum profissional disponível
        </h3>

        <p className="
          text-sm
          text-stone-400
          mt-1
        ">
          Tente novamente mais tarde
        </p>
      </div>
    );
  }


  function handleSelect(prof: Profissional) {
    setSelectedId(prof.id);
    setIsLeaving(true);

    setTimeout(() => {
      onSelect(prof);
    }, 350);
  }


  return (
    <div
      className={`
        space-y-6
        transition-all
        duration-300
        ease-out

        ${
          isLeaving
            ? "opacity-0 translate-x-8 scale-95"
            : "opacity-100 translate-x-0 scale-100"
        }
      `}
    >

      {/* Cabeçalho */}
      <div>
        <div className="
          flex
          items-center
          gap-2
          mb-2
        ">
          <Scissors
            size={20}
            className="text-amber-500"
          />

          <span className="
            text-xs
            uppercase
            tracking-wider
            font-semibold
            text-amber-600
          ">
            Profissionais
          </span>
        </div>


        <h2 className="
          text-2xl
          font-bold
          text-stone-900
          tracking-tight
        ">
          Escolha seu barbeiro
        </h2>


        <p className="
          text-stone-500
          text-sm
          mt-1
        ">
          Selecione quem irá realizar seu atendimento
        </p>
      </div>



      {/* Lista */}
      <div className="grid gap-4">

        {profissionais.map((prof) => {
          const isSelected = selectedId === prof.id;


          return (
            <button
              key={prof.id}
              type="button"
              disabled={isLeaving}
              onClick={() => handleSelect(prof)}
              className={`
                group
                relative
                w-full
                text-left
                rounded-3xl
                overflow-hidden

                transition-all
                duration-300
                active:scale-[0.97]

                border

                ${
                  isSelected
                    ? `
                      border-amber-400
                      bg-gradient-to-br
                      from-amber-50
                      via-white
                      to-white
                      shadow-lg
                      shadow-amber-100
                    `
                    : `
                      border-stone-200
                      bg-white
                      hover:border-stone-300
                      hover:shadow-md
                    `
                }

                ${
                  isLeaving
                    ? "cursor-wait"
                    : ""
                }
              `}
            >

              <div className="
                flex
                items-center
                gap-4
                p-5
              ">


                {/* Avatar */}
                <div className="relative">

                  <div
                    className={`
                      w-16
                      h-16
                      rounded-2xl
                      flex
                      items-center
                      justify-center

                      transition-all
                      duration-300

                      ${
                        isSelected
                          ? `
                            bg-gradient-to-br
                            from-amber-400
                            to-amber-600
                            text-white
                            rotate-3
                            scale-110
                          `
                          : `
                            bg-stone-100
                            text-stone-500
                            group-hover:bg-stone-200
                          `
                      }
                    `}
                  >
                    <User size={28} />
                  </div>


                  {isSelected && (
                    <div className="
                      absolute
                      -right-2
                      -bottom-2
                      bg-white
                      rounded-full
                      p-1
                      shadow-md
                    ">
                      <div className="
                        bg-amber-500
                        rounded-full
                        p-1
                      ">
                        <Check
                          size={12}
                          className="text-white"
                        />
                      </div>
                    </div>
                  )}

                </div>



                {/* Informações */}
                <div className="flex-1 min-w-0">

                  <h3 className="
                    text-lg
                    font-bold
                    text-stone-900
                    truncate
                  ">
                    {prof.nome}
                  </h3>


                  {prof.especialidade && (
                    <p className="
                      text-sm
                      text-stone-500
                      mt-1
                      truncate
                    ">
                      {prof.especialidade}
                    </p>
                  )}



                  {prof.avaliacao !== undefined && (
                    <div className="
                      flex
                      items-center
                      gap-1
                      mt-2
                    ">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={
                            star <= prof.avaliacao!
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-300"
                          }
                        />
                      ))}

                      <span className="
                        text-xs
                        text-stone-500
                        ml-1
                      ">
                        {prof.avaliacao.toFixed(1)}
                      </span>
                    </div>
                  )}

                </div>



                {/* Seta */}
                <ChevronRight
                  size={22}
                  className={`
                    transition-all
                    duration-300

                    ${
                      isSelected
                        ? "text-amber-500 translate-x-1"
                        : `
                          text-stone-300
                          group-hover:text-stone-500
                          group-hover:translate-x-1
                        `
                    }
                  `}
                />

              </div>



              {isSelected && (
                <div className="
                  absolute
                  top-3
                  right-12
                  text-xs
                  font-semibold
                  text-amber-600
                  animate-pulse
                ">
                  Selecionado
                </div>
              )}

            </button>
          );
        })}

      </div>

    </div>
  );
}