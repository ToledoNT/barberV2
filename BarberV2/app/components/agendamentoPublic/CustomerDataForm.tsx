import { User, Phone } from "lucide-react";

interface Props {
  nome: string;
  telefone: string;
  onNomeChange: (nome: string) => void;
  onTelefoneChange: (telefone: string) => void;
  onRemoverServico: () => void;
}

export function CustomerDataForm({ nome, telefone, onNomeChange, onTelefoneChange, onRemoverServico }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm animate-fade-in">
      <div className="relative">
        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => onNomeChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
        />
      </div>
      <div className="relative">
        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="tel"
          placeholder="Telefone (com DDD)"
          value={telefone}
          onChange={(e) => onTelefoneChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
        />
      </div>
      <button
        onClick={onRemoverServico}
        className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-xl transition-all border border-red-200"
      >
        Remover serviço agendado
      </button>
    </div>
  );
}