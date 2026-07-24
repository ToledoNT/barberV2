"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  ChevronRight,
  Scissors,
  Check,
} from "lucide-react";

interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  valor: number;
  duracao: number;
}

interface ServicesStepProps {
  servicos: Servico[];
  horariosCount: number;
  selectedServicoId?: string;
  onBack: () => void;
  onAddHorario: (servico: Servico) => void;
  onRemove?: (id: string) => void;
  isAdding?: boolean;
}

export function ServicesStep({
  servicos,
  horariosCount,
  selectedServicoId,
  onAddHorario,
  isAdding = false,
}: ServicesStepProps) {

  const [selectedId, setSelectedId] = useState<
    string | undefined
  >(selectedServicoId);


  useEffect(() => {
    setSelectedId(selectedServicoId);
  }, [selectedServicoId]);



  function formatCurrency(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }



  function handleSelectServico(servico: Servico) {

    // Atualiza visual imediatamente
    setSelectedId(servico.id);

    // Envia para o componente pai
    onAddHorario(servico);
  }



  return (
    <div className="space-y-6">


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
            font-semibold
            uppercase
            tracking-wider
            text-amber-600
          ">
            Serviços
          </span>
        </div>


        <h2 className="
          text-2xl
          font-bold
          text-stone-900
        ">
          Escolha o serviço
        </h2>


        <p className="
          text-sm
          text-stone-500
          mt-1
        ">
          Selecione o atendimento desejado
        </p>

      </div>




      {/* Lista de serviços */}
      <div className="grid gap-4">

        {servicos.map((servico) => {

          const isSelected =
            selectedId === servico.id;


          return (
            <button
              key={servico.id}
              type="button"
              onClick={() => handleSelectServico(servico)}
              className={`
                group
                w-full
                text-left
                rounded-3xl
                border
                p-5

                transition-all
                duration-300

                active:scale-[0.98]

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
                      scale-[1.01]
                    `
                    : `
                      bg-white
                      border-stone-200
                      hover:border-stone-300
                      hover:shadow-md
                    `
                }
              `}
            >

              <div className="
                flex
                items-center
                gap-4
              ">


                {/* Ícone */}
                <div
                  className={`
                    w-14
                    h-14
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
                          scale-105
                        `
                        : `
                          bg-stone-100
                          text-stone-500
                          group-hover:bg-stone-200
                        `
                    }
                  `}
                >
                  {isSelected ? (
                    <Check size={26} />
                  ) : (
                    <Scissors size={24} />
                  )}
                </div>




                {/* Informações */}
                <div className="flex-1 min-w-0">

                  <h3 className="
                    font-bold
                    text-lg
                    text-stone-900
                  ">
                    {servico.nome}
                  </h3>



                  {servico.descricao && (
                    <p className="
                      text-sm
                      text-stone-500
                      mt-1
                      line-clamp-2
                    ">
                      {servico.descricao}
                    </p>
                  )}




                  <div className="
                    flex
                    items-center
                    gap-4
                    mt-3
                  ">

                    <span className="
                      font-bold
                      text-amber-600
                    ">
                      {formatCurrency(servico.valor)}
                    </span>


                    <span className="
                      flex
                      items-center
                      gap-1
                      text-xs
                      text-stone-500
                    ">
                      <Clock size={14}/>
                      {servico.duracao} min
                    </span>

                  </div>

                </div>





                {/* Seta */}
                <ChevronRight
                  size={22}
                  className={`
                    transition-all
                    duration-300

                    ${
                      isSelected
                        ? `
                          text-amber-500
                          translate-x-1
                        `
                        : `
                          text-stone-300
                          group-hover:text-stone-500
                          group-hover:translate-x-1
                        `
                    }
                  `}
                />

              </div>

            </button>
          );
        })}

      </div>





      {/* Sem horários */}
      {horariosCount === 0 && !isAdding && (
        <div className="
          rounded-2xl
          border
          border-amber-200
          bg-amber-50
          p-4
          text-center
        ">
          <p className="
            text-sm
            text-amber-700
            font-medium
          ">
            ⚠️ Nenhum horário disponível para este profissional.
          </p>

          <p className="
            text-xs
            text-amber-600
            mt-1
          ">
            Escolha outro serviço ou profissional.
          </p>
        </div>
      )}

    </div>
  );
}