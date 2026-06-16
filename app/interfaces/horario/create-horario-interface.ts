export interface ICreateHorario {
  profissionalId: string;       
  data: Date;             
  inicio: string;         
  fim: string;            
  disponivel?: boolean;   
}

export interface HorarioInputProps {
  value: string;
  onChange: (value: string) => void;
}
