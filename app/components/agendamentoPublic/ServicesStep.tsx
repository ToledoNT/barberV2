"use client";

import React from "react";
import { Clock, ChevronRight } from "lucide-react";

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
  onBack,
  onAddHorario,
  isAdding = false,
}: ServicesStepProps) {
  return (
    <div className="space-y-4">


      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800">Escolha o serviço</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Selecione uma das opções abaixo
          </p>
        </div>

        <div className="divide-y divide-stone-100">
          {servicos.map((servico) => {
            const isSelected = selectedServicoId === servico.id;
            return (
              <button
                key={servico.id}
                onClick={() => onAddHorario(servico)}
                className={`w-full text-left p-4 transition-colors duration-150 ${
                  isSelected
                    ? "bg-amber-50 border-l-4 border-amber-500"
                    : "hover:bg-stone-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-800">{servico.nome}</h3>
                    {servico.descricao && (
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                        {servico.descricao}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                      <span className="font-semibold text-amber-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(servico.valor)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{servico.duracao} min</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`mt-1 ${
                      isSelected ? "text-amber-600" : "text-stone-400"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {horariosCount === 0 && !isAdding && (
          <div className="p-4 text-center text-stone-500 text-sm border-t border-stone-100">
            ⚠️ Nenhum horário disponível para este profissional.
          </div>
        )}
      </div>
    </div>
  );
}