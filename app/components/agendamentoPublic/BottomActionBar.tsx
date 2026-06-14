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
  function formatMoney(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatData(data?: string) {
    if (!data) return "";
    const ano = new Date().getFullYear();
    return `${data}/${ano}`;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            {/* INFO */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-stone-900 truncate">
                {nomeServico}
              </p>
              <p className="text-xs text-stone-500">
                {dataStr && `${formatData(dataStr)} • `}
                {horarioStr}
              </p>
              <p className="text-xs font-semibold text-amber-600 mt-0.5">
                {formatMoney(total)}
              </p>
            </div>

            {/* BUTTON */}
            <button
              onClick={onFinalizar}
              disabled={disabled}
              className={`
                shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition 
                ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.98]"}
              `}
            >
              {buttonLabel}
            </button>
          </div>
          {/* HELPER TEXT */}
          {helperText && disabled && (
            <p className="text-xs text-amber-600 text-center">{helperText}</p>
          )}
        </div>
      </div>
    </div>
  );
}