interface CartBarProps {
  nomeServico: string;
  horarioStr: string;
  valor: number;
  total: number;
  onFinalizar: () => void;
  buttonLabel?: string;
}

export function CartBottomBar({ nomeServico, horarioStr, valor, total, onFinalizar, buttonLabel = "Finalizar" }: CartBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-stone-200 shadow-md rounded-t-xl p-2 animate-slide-up">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2 text-sm">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 truncate">
            <span className="font-medium text-stone-800 truncate">{nomeServico}</span>
            <span className="text-stone-400 text-xs">•</span>
            <span className="text-stone-500 text-xs">{horarioStr}</span>
          </div>
          <div className="flex justify-between text-xs text-stone-500 mt-0.5">
            <span>Total: R$ {total.toFixed(2)}</span>
            <span>{valor > 0 ? `R$ ${valor}` : ""}</span>
          </div>
        </div>
        <button
          onClick={onFinalizar}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-1.5 rounded-full text-sm shadow transition-all"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}