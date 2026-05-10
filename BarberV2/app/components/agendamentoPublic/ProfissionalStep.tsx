"use client";

import React, { useState } from "react";
import { User, ChevronRight, Check, Star } from "lucide-react";

interface Profissional {
  id: string;
  nome: string;
  especialidade?: string;
  avaliacao?: number; // opcional: 0-5
}

interface ProfessionalsStepProps {
  profissionais: Profissional[];
  onSelect: (profissional: Profissional) => void;
}

export function ProfessionalsStep({ profissionais, onSelect }: ProfessionalsStepProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!profissionais || profissionais.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-3">
          <User size={28} className="text-stone-400" />
        </div>
        <h3 className="text-stone-700 font-medium">Nenhum profissional disponível</h3>
        <p className="text-stone-400 text-sm mt-1">Tente novamente mais tarde</p>
      </div>
    );
  }

  function handleSelect(prof: Profissional) {
    setSelectedId(prof.id);
    onSelect(prof);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-800 tracking-tight">Escolha seu profissional</h2>
        <p className="text-stone-500 text-sm mt-1">Selecione quem vai te atender</p>
      </div>

      <div className="grid gap-3">
        {profissionais.map((prof) => {
          const isSelected = selectedId === prof.id;

          return (
            <button
              key={prof.id}
              onClick={() => handleSelect(prof)}
              className={`
                group relative w-full text-left
                bg-white rounded-2xl
                transition-all duration-300 ease-out
                border-2
                ${isSelected 
                  ? "border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-md shadow-amber-100/50" 
                  : "border-stone-100 hover:border-stone-200 hover:shadow-sm"
                }
              `}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Avatar com gradiente e indicador de seleção */}
                <div className="relative">
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${isSelected 
                      ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md" 
                      : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
                    }
                  `}>
                    <User size={24} />
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <Check size={14} className="text-amber-500" />
                    </div>
                  )}
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-800 text-lg tracking-tight">
                    {prof.nome}
                  </h3>
                  {prof.especialidade && (
                    <p className="text-stone-500 text-sm mt-0.5 line-clamp-1">
                      {prof.especialidade}
                    </p>
                  )}
                  {prof.avaliacao && (
                    <div className="flex items-center gap-1 mt-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < Math.floor(prof.avaliacao!) 
                            ? "fill-amber-400 text-amber-400" 
                            : "text-stone-300"
                          }
                        />
                      ))}
                      <span className="text-xs text-stone-500 ml-1">
                        {prof.avaliacao.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Ícone de avanço */}
                <ChevronRight 
                  size={20} 
                  className={`
                    transition-all duration-300
                    ${isSelected 
                      ? "text-amber-500 translate-x-0.5" 
                      : "text-stone-400 group-hover:text-stone-500 group-hover:translate-x-0.5"
                    }
                  `} 
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}