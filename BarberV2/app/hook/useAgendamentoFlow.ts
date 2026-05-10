// hook/useAgendamentoFlow.ts
import { useState } from "react";
import { Agendamento, ItemCarrinho } from "../interfaces/agendamentoInterface";
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
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
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

  const adicionarAoCarrinho = (horario: any, pessoaGrupo?: { id: string; nome: string }) => {
    if (!tempServico) return;
    const novoItem: ItemCarrinho = { servico: tempServico, horario };
    if (pessoaGrupo) novoItem.pessoaGrupo = pessoaGrupo;
    setCarrinho([...carrinho, novoItem]);
    notify(`${tempServico.nome} adicionado!`, "success");
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
      const payload: Agendamento = {
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email,
        data: item.horario.data || "",
        hora: item.horario.inicio,
        inicio: item.horario.inicio,
        fim: item.horario.fim,
        servico: item.servico.nome,
        barbeiro: selectedProfissional?.nome || item.pessoaGrupo?.profissional?.nome || "",
        profissionalId: String(selectedProfissional?.id || item.pessoaGrupo?.profissional?.id),
        servicoId: String(item.servico.id),
        servicoNome: item.servico.nome,
        servicoPreco: item.servico.valor,
      };
      await addAgendamento(payload);
    }

    notify("✅ Agendamento(s) realizado(s)!", "success");
    // Reset completo
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
  const totalCarrinho = carrinho.reduce((acc, i) => acc + i.servico.valor, 0);
  const isServicoSelecionado = (servicoId: string | number) =>
    carrinho.some(item => String(item.servico.id) === String(servicoId));

  return {
    // estados
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
    // setters
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
    // actions
    notify,
    confirm,
    removerDoCarrinho,
    adicionarAoCarrinho,
    finalizarAgendamento,
    iniciarAgendamento,
    isServicoSelecionado,
  };
}