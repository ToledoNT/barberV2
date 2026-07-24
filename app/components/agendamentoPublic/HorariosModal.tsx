"use client";

import { useEffect, useMemo, useState } from "react";
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


function getDatasUnicas(horarios: any[]) {

  const datas = new Map<string, any[]>();

  horarios.forEach((h) => {

    if (!h.data) return;

    if (!datas.has(h.data)) {
      datas.set(h.data, []);
    }

    datas.get(h.data)!.push(h);

  });


  return Array.from(datas.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([data, horarios]) => ({
      data,
      horarios,
    }));
}



export function HorariosModal({
  isOpen,
  servicoNome,
  horarios,
  onClose,
  onSelectHorario,
}: Props) {


  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);



  const datasAgrupadas = useMemo(
    () => getDatasUnicas(horarios),
    [horarios]
  );



  /**
   * Sempre que trocar serviço/horários:
   * limpa seleção antiga
   * e escolhe a primeira data disponível
   */
  useEffect(() => {

    if (!isOpen) {
      setSelectedDate(null);
      return;
    }


    if (datasAgrupadas.length > 0) {

      setSelectedDate(
        datasAgrupadas[0].data
      );

    } else {

      setSelectedDate(null);

    }


  }, [isOpen, horarios]);





  const horariosFiltrados = useMemo(() => {


    if (!selectedDate) {
      return [];
    }


    const grupo =
      datasAgrupadas.find(
        (item) =>
          item.data === selectedDate
      );


    if (!grupo) {
      return [];
    }



    return [...grupo.horarios].sort(
      (a, b) => {

        const [horaA, minutoA] =
          a.inicio.split(":").map(Number);


        const [horaB, minutoB] =
          b.inicio.split(":").map(Number);


        return (
          horaA * 60 +
          minutoA -
          (horaB * 60 + minutoB)
        );

      }
    );


  }, [
    selectedDate,
    datasAgrupadas,
  ]);



  if (!isOpen) {
    return null;
  }



  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
        p-4
      "
      onClick={onClose}
    >

      <div
        className="
          bg-white
          rounded-3xl
          max-w-md
          w-full
          max-h-[85vh]
          overflow-hidden
          shadow-xl
          flex
          flex-col
          animate-scale-in
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >


        {/* Header */}
        <div className="
          px-5
          py-4
          border-b
          flex
          justify-between
          items-center
        ">

          <h3 className="
            font-bold
            text-stone-800
            text-lg
          ">
            Horário para{" "}
            <span className="
              text-amber-600
            ">
              {servicoNome}
            </span>
          </h3>


          <button
            onClick={onClose}
            className="
              p-2
              rounded-full
              hover:bg-stone-100
              text-stone-400
            "
          >
            <X size={20}/>
          </button>

        </div>





        {/* Datas */}
        <div className="
          px-4
          pt-4
          border-b
        ">

          <div className="
            flex
            gap-2
            overflow-x-auto
            pb-3
          ">

            {datasAgrupadas.map((grupo) => (

              <button
                key={grupo.data}
                onClick={() =>
                  setSelectedDate(
                    grupo.data
                  )
                }
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-medium
                  transition-all

                  ${
                    selectedDate === grupo.data
                      ?
                      `
                      bg-amber-500
                      text-white
                      shadow-md
                      `
                      :
                      `
                      bg-stone-100
                      text-stone-700
                      hover:bg-stone-200
                      `
                  }
                `}
              >

                {formatarDataBr(
                  grupo.data
                )}

              </button>

            ))}

          </div>

        </div>





        {/* Horários */}
        <div className="
          flex-1
          overflow-y-auto
          p-4
        ">


          {horariosFiltrados.length === 0 ? (

            <div className="
              py-12
              text-center
              text-stone-400
            ">
              Nenhum horário disponível.
            </div>


          ) : (

            <div className="
              grid
              grid-cols-2
              gap-3
            ">

              {horariosFiltrados.map(
                (horario) => (

                <button
                  key={horario.id}
                  onClick={() =>
                    onSelectHorario(
                      horario
                    )
                  }
                  className="
                    bg-stone-50
                    border
                    border-stone-200
                    rounded-xl
                    p-3
                    hover:border-amber-400
                    hover:bg-amber-50
                    transition-all
                    active:scale-95
                  "
                >

                  <div className="
                    text-xs
                    text-stone-400
                  ">
                    {formatarDataBr(
                      horario.data
                    )}
                  </div>


                  <div className="
                    font-bold
                    text-stone-700
                  ">
                    {horario.inicio}
                  </div>


                  <div className="
                    text-xs
                    text-stone-400
                  ">
                    até {horario.fim}
                  </div>


                </button>

              ))}

            </div>

          )}


        </div>


      </div>

    </div>
  );
}