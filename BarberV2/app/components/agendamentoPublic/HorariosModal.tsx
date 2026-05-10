"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  servicoNome?: string;
  horarios: any[];
  onClose: () => void;
  onSelectHorario: (horario: any) => void;
}

function formatarDataBr(dataStr: string) {
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}`;
}

function formatarDataChip(dataStr: string) {
  return formatarDataBr(dataStr);
}

function getDatasUnicas(horarios: any[]) {
  const datas = new Map<string, any[]>();
  horarios.forEach((h) => {
    if (h.data) {
      if (!datas.has(h.data)) datas.set(h.data, []);
      datas.get(h.data)!.push(h);
    }
  });
  const sortedDatas = Array.from(datas.keys()).sort((a, b) => a.localeCompare(b));
  return sortedDatas.map((data) => ({ data, horarios: datas.get(data)! }));
}

export function HorariosModal({ isOpen, servicoNome, horarios, onClose, onSelectHorario }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const datasAgrupadas = useMemo(() => getDatasUnicas(horarios), [horarios]);

  useMemo(() => {
    if (isOpen && datasAgrupadas.length > 0 && !selectedDate) {
      setSelectedDate(datasAgrupadas[0].data);
    }
  }, [isOpen, datasAgrupadas, selectedDate]);

  const horariosFiltrados = useMemo(() => {
    if (!selectedDate) return [];
    const grupo = datasAgrupadas.find((g) => g.data === selectedDate);
    return grupo ? grupo.horarios : [];
  }, [selectedDate, datasAgrupadas]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-xl animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fixo */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b px-5 py-4 flex justify-between items-center z-10">
          <h3 className="font-bold text-stone-800 text-lg">
            Escolha um horário para <span className="text-amber-600">{servicoNome}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition rounded-full p-1 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filtro de datas (chips horizontais com scroll) */}
        {datasAgrupadas.length > 0 && (
          <div className="px-4 pt-4 pb-2 border-b border-stone-100">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300">
              {datasAgrupadas.map((grupo) => {
                const isActive = selectedDate === grupo.data;
                return (
                  <button
                    key={grupo.data}
                    onClick={() => setSelectedDate(grupo.data)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                      ${
                        isActive
                          ? "bg-amber-500 text-white shadow-md"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }
                    `}
                  >
                    {formatarDataChip(grupo.data)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista de horários da data selecionada */}
        <div className="flex-1 overflow-y-auto p-4">
          {horariosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-400">
              <p className="text-center">Nenhum horário disponível nesta data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {horariosFiltrados.map((horario, idx) => (
                <button
                  key={horario.id}
                  onClick={() => onSelectHorario(horario)}
                  className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all hover:-translate-y-0.5 active:scale-95 animate-fade-in"
                  style={{ animationDelay: `${idx * 30}ms`, animationFillMode: "backwards" }}
                >
                  {horario.data && (
                    <div className="text-xs text-stone-400 mb-1">
                      {formatarDataBr(horario.data)}
                    </div>
                  )}
                  <span className="font-medium text-stone-700">{horario.inicio}</span>
                  <span className="text-stone-400 text-xs block">até {horario.fim}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}