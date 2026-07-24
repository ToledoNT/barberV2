"use client";

import { Scissors, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface CartBarProps {
  nomeServico: string;
  horarioStr: string;
  dataStr?: string;
  valor: number;
  total: number;
  onFinalizar: () => void;
  buttonLabel?: string;
  disabled?: boolean;
  helperText?: string;
}

export function CartBottomBar({
  nomeServico,
  horarioStr,
  dataStr,
  total,
  onFinalizar,
  buttonLabel = "Finalizar",
  disabled = false,
  helperText,
}: CartBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (nomeServico) {
      setShouldRender(true);
      // Pequeno delay para trigger da animação
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      // Aguarda a animação de saída terminar
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [nomeServico]);

  function formatMoney(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatData(data?: string) {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return dia ? `${dia}/${mes}/${ano}` : data;
  }

  // Se não tiver serviço e não estiver visível, não renderiza
  if (!shouldRender && !nomeServico) return null;

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-40 pointer-events-none
        transition-all duration-400 ease-out
        ${isVisible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-full opacity-0"
        }
      `}
    >
      <div className="max-w-md mx-auto px-4 pb-4 pointer-events-auto">
        {/* Card principal com animação de entrada suave */}
        <div className={`
          relative
          bg-white/95 backdrop-blur-xl
          rounded-2xl
          border border-white/20
          shadow-[0_-8px_40px_rgba(0,0,0,0.08)]
          p-4
          transition-all duration-500 ease-out
          ${isVisible 
            ? "scale-100 opacity-100" 
            : "scale-95 opacity-0"
          }
          hover:shadow-[0_-8px_50px_rgba(0,0,0,0.12)]
        `}>
          {/* Barra decorativa superior com animação */}
          <div className={`
            absolute -top-[1px] left-8 right-8 h-[2px] 
            bg-gradient-to-r from-transparent via-amber-400 to-transparent 
            transition-all duration-700 delay-200
            ${isVisible ? "opacity-50" : "opacity-0"}
          `} />
          
          <div className="flex items-center gap-3">
            {/* Ícone com animação de escala */}
            <div className={`
              relative
              w-12 h-12
              rounded-xl
              bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600
              flex items-center justify-center
              shadow-lg shadow-amber-500/25
              transition-all duration-500 delay-100
              ${isVisible 
                ? "scale-100 rotate-0 opacity-100" 
                : "scale-0 -rotate-45 opacity-0"
              }
            `}>
              <Scissors size={20} className="text-white drop-shadow-sm" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent" />
            </div>

            {/* Informações do serviço com animação de deslize */}
            <div className={`
              flex-1 min-w-0
              transition-all duration-500 delay-200
              ${isVisible 
                ? "translate-x-0 opacity-100" 
                : "translate-x-4 opacity-0"
              }
            `}>
              <p className="
                text-sm font-semibold
                text-stone-900
                truncate
                leading-tight
              ">
                {nomeServico}
              </p>
              
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock size={12} className="text-stone-400" />
                <p className="text-xs text-stone-500 truncate">
                  {dataStr && (
                    <>
                      <span className="font-medium text-stone-700">
                        {formatData(dataStr)}
                      </span>
                      {" • "}
                    </>
                  )}
                  <span className="text-stone-600">{horarioStr}</span>
                </p>
              </div>
              
              <p className="
                text-base font-bold
                text-amber-600
                mt-0.5
                tracking-tight
              ">
                {formatMoney(total)}
              </p>
            </div>

            {/* Botão com animação de entrada */}
            <button
              onClick={onFinalizar}
              disabled={disabled}
              className={`
                relative
                group
                shrink-0
                flex items-center gap-1.5
                px-5 py-2.5
                rounded-xl
                text-sm font-semibold
                text-white
                transition-all duration-500 delay-300
                ${isVisible 
                  ? "scale-100 opacity-100" 
                  : "scale-0 opacity-0"
                }
                ${disabled 
                  ? "bg-stone-300 cursor-not-allowed opacity-60" 
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35"
                }
              `}
            >
              <span>{buttonLabel}</span>
              <ChevronRight 
                size={16} 
                className={`
                  transition-transform duration-200
                  ${!disabled && "group-hover:translate-x-0.5"}
                `}
              />
              
              {!disabled && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          </div>

          {/* Helper text com animação */}
          {helperText && disabled && (
            <div className={`
              mt-3 pt-3 border-t border-stone-200/50 
              transition-all duration-500 delay-400
              ${isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 -translate-y-2"
              }
            `}>
              <p className="text-xs text-amber-600 text-center font-medium">
                {helperText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}