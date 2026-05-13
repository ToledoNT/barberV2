import { useState } from "react";
import { Agendamento } from "../interfaces/agendamentoInterface";
import { useAgendamentoPublic } from "./useAgendamentoPublic";

export type Step = "membros" | "profissionais" | "servicos" | "carrinho";
export type MainScreen = "escolha" | "agendamento";
export type CartSubStep = "email" | "verificacao" | "dados";

export function useAgendamentoFlow() {
  const { profissionais, loading, error, addAgendamento } = useAgendamentoPublic();

  const [mainScreen, setMainScreen] = useState<MainScreen>("escolha");
  const [step, setStep] = useState<Step>("profissionais");
  const [cartSubStep, setCartSubStep] = useState<CartSubStep>("email");

  const [selectedProfissional, setSelectedProfissional] = useState<any>(null);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [tempServico, setTempServico] = useState<any>(null);
  const [showHorariosModal, setShowHorariosModal] = useState(false);

  const [cliente, setCliente] = useState({ nome: "", telefone: "", email: "" });

  const [notification, setNotification] = useState<any>({
    isOpen: false,
    message: "",
    type: "info",
  });
  const [confirmDialog, setConfirmDialog] = useState<any>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const notify = (message: string, type: any = "info") => {
    setNotification({ isOpen: true, message, type });
  };

  const confirm = (title: string, message: any, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, type: "info", onConfirm });
  };

  const removerDoCarrinho = () => {
    setCarrinho([]);
    if (step === "carrinho") {
      setCartSubStep("email");
    }
    notify("Serviço removido. Você pode escolher outro.", "info");
  };

  const adicionarAoCarrinho = (item: {
    servico: any;
    profissional: any;
    horario: any;
    pessoaGrupo?: { id: string; nome: string };
  }) => {
    if (!item.servico) {
      console.error("Tentativa de adicionar item sem serviço", item);
      return;
    }
    const novoItem: any = {
      servico: item.servico,
      horario: item.horario,
      profissional: item.profissional,
    };
    if (item.pessoaGrupo) novoItem.pessoaGrupo = item.pessoaGrupo;
    setCarrinho((prev) => [...prev, novoItem]);
    notify(`${item.servico.nome} adicionado!`, "success");
    setShowHorariosModal(false);
    setTempServico(null);
  };

  const finalizarAgendamento = async () => {
    if (carrinho.length === 0) {
      notify("Nenhum serviço agendado", "warning");
      return;
    }
    if (!cliente.nome.trim() || !cliente.telefone.trim()) {
      notify("Por favor, preencha nome e telefone", "warning");
      return;
    }

    for (const item of carrinho) {
      const profissional = item.profissional || selectedProfissional;
      const horario = item.horario;
      const payload: Agendamento = {
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email,
        data: horario.data || "",
        hora: horario.inicio,
        inicio: horario.inicio,
        fim: horario.fim,
        servico: item.servico.nome,
        barbeiro: profissional?.nome || item.pessoaGrupo?.profissional?.nome || "",
        profissionalId: String(profissional?.id || item.pessoaGrupo?.profissional?.id),
        servicoId: String(item.servico.id),
        servicoNome: item.servico.nome,
        servicoPreco: item.servico.valor,
      };
      await addAgendamento(payload);
    }

    notify("✅ Agendamento(s) realizado(s)!", "success");
    setMainScreen("escolha");
    setStep("profissionais");
    setSelectedProfissional(null);
    setCarrinho([]);
    setCliente({ nome: "", telefone: "", email: "" });
    setCartSubStep("email");
  };

  const iniciarAgendamento = () => {
    setMainScreen("agendamento");
    setStep("profissionais");
    setSelectedProfissional(null);
    setCarrinho([]);
    setCliente({ nome: "", telefone: "", email: "" });
    setCartSubStep("email");
  };

  const horariosDisponiveis = selectedProfissional?.horarios?.filter((h: any) => h.disponivel !== false) || [];
  const servicosDoProfissional = selectedProfissional?.procedimentos || [];
  const totalCarrinho = carrinho.reduce((acc, i) => acc + (i.servico?.valor || 0), 0);
  const isServicoSelecionado = (servicoId: string | number) =>
    carrinho.some(item => String(item.servico?.id) === String(servicoId));

  return {
    mainScreen,
    step,
    cartSubStep,
    selectedProfissional,
    carrinho,
    cliente,
    tempServico,
    showHorariosModal,
    notification,
    confirmDialog,
    loading,
    error,
    profissionais,
    horariosDisponiveis,
    servicosDoProfissional,
    totalCarrinho,
    setMainScreen,
    setStep,
    setCartSubStep,
    setSelectedProfissional,
    setCarrinho,
    setCliente,
    setTempServico,
    setShowHorariosModal,
    setNotification,
    setConfirmDialog,
    notify,
    confirm,
    removerDoCarrinho,
    adicionarAoCarrinho,
    finalizarAgendamento,
    iniciarAgendamento,
    isServicoSelecionado,
  };
}