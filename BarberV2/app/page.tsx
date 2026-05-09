"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAgendamentosAdmin } from "./hook/useAgendamentoAdmin";
import { Notification } from "./components/ui/componenteNotificacao";
import { ConfirmDialog } from "./components/ui/componenteConfirmação";
import { Agendamento } from "./interfaces/agendamentoInterface";
import { Trash2, X, Plus, ArrowLeft, Check, User, Phone, Mail, Loader2, Calendar } from "lucide-react";

type Step = "profissionais" | "servicos" | "carrinho";
type MainScreen = "escolha" | "agendamento";
type CarrinhoStep = "email" | "verificacao" | "dados";

interface ItemCarrinho {
  servico: any;
  horario: any;
}

export default function Home() {
  const {
    barbeiros,
    horarios,
    procedimentosBarbeiro,
    addAgendamento,
    fetchBarbeiroDados,
  } = useAgendamentosAdmin();

  const [mainScreen, setMainScreen] = useState<MainScreen>("escolha");
  const [step, setStep] = useState<Step>("profissionais");
  const [selectedProfissional, setSelectedProfissional] = useState<any>(null);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  const [cliente, setCliente] = useState({
    nome: "",
    telefone: "",
    email: "",
  });

  const [carrinhoStep, setCarrinhoStep] = useState<CarrinhoStep>("email");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [enviandoCodigo, setEnviandoCodigo] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [emailVerificado, setEmailVerificado] = useState(false);

  const [showHorariosModal, setShowHorariosModal] = useState(false);
  const [tempServico, setTempServico] = useState<any>(null);

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
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      type: "info",
      onConfirm,
    });
  };

  const enviarCodigoVerificacao = async () => {
    if (!cliente.email.trim()) {
      notify("Digite seu e-mail primeiro", "warning");
      return;
    }

    setEnviandoCodigo(true);
    try {
      const response = await fetch("/api/enviar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cliente.email }),
      });

      if (!response.ok) throw new Error("Erro ao enviar código");

      notify("Código enviado! Verifique seu e-mail.", "success");
      setCodigoEnviado(true);
      setCarrinhoStep("verificacao");
    } catch (error) {
      console.error(error);
      notify("Não foi possível enviar o código. Tente novamente.", "error");
    } finally {
      setEnviandoCodigo(false);
    }
  };

  const verificarCodigo = async () => {
    if (codigoDigitado.length !== 6) {
      notify("Digite o código de 6 dígitos", "warning");
      return;
    }

    setVerificando(true);
    try {
      const response = await fetch("/api/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cliente.email, codigo: codigoDigitado }),
      });

      if (!response.ok) throw new Error("Código inválido");

      notify("E-mail verificado com sucesso!", "success");
      setEmailVerificado(true);
      setCarrinhoStep("dados");
    } catch (error) {
      console.error(error);
      notify("Código incorreto ou expirado. Tente novamente.", "error");
    } finally {
      setVerificando(false);
    }
  };

  const finalizarAgendamento = async () => {
    if (carrinho.length === 0) {
      notify("Nenhum serviço agendado", "warning");
      return;
    }

    if (!cliente.nome.trim()) {
      notify("Por favor, informe seu nome", "warning");
      return;
    }
    if (!cliente.telefone.trim()) {
      notify("Por favor, informe seu telefone", "warning");
      return;
    }

    const item = carrinho[0];
    const payload: Agendamento = {
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      data: item.horario.data || "",
      hora: item.horario.inicio,
      inicio: item.horario.inicio,
      fim: item.horario.fim,
      servico: item.servico.nome,
      barbeiro: selectedProfissional.nome,
      profissionalId: String(selectedProfissional.id),
      servicoId: String(item.servico.id),
      servicoNome: item.servico.nome,
      servicoPreco: item.servico.valor,
    };

    try {
      await addAgendamento(payload);
      notify(`✅ Agendamento realizado!`, "success");
      setMainScreen("escolha");
      setStep("profissionais");
      setSelectedProfissional(null);
      setCarrinho([]);
      setCliente({ nome: "", telefone: "", email: "" });
      setCarrinhoStep("email");
      setCodigoEnviado(false);
      setCodigoDigitado("");
      setEmailVerificado(false);
    } catch (err) {
      console.error(err);
      notify("Erro ao criar agendamento", "error");
    }
  };

  const removerDoCarrinho = () => {
    setCarrinho([]);
    if (step === "carrinho") {
      setCarrinhoStep("email");
      setEmailVerificado(false);
      setCodigoEnviado(false);
      setCodigoDigitado("");
    }
    notify("Serviço removido. Você pode escolher outro.", "info");
  };

  const iniciarAgendamento = () => {
    setMainScreen("agendamento");
    setStep("profissionais");
    setSelectedProfissional(null);
    setCarrinho([]);
    setCliente({ nome: "", telefone: "", email: "" });
    setCarrinhoStep("email");
    setEmailVerificado(false);
    setCodigoEnviado(false);
    setCodigoDigitado("");
  };

  const agendamentoGrupo = () => {
    notify("📋 Agendamento em grupo - Em breve disponível!", "info");
  };

  const handleSelectProfissional = async (prof: any) => {
    setSelectedProfissional(prof);
    await fetchBarbeiroDados(prof.id);
    setStep("servicos");
  };

  const abrirSelecionarHorario = (servico: any) => {
    if (horarios.length === 0) {
      notify("Não há horários disponíveis para este profissional.", "warning");
      return;
    }
    setTempServico(servico);
    setShowHorariosModal(true);
  };

  const adicionarAoCarrinho = (horario: any) => {
    if (!tempServico) return;
    setCarrinho([{ servico: tempServico, horario }]);
    notify(`${tempServico.nome} adicionado! Clique em "Continuar" para finalizar.`, "success");
    setShowHorariosModal(false);
    setTempServico(null);
  };

  const totalCarrinho = carrinho.reduce((acc, i) => acc + i.servico.valor, 0);

  const formatarDataHora = (horario: any) => {
    if (horario.data) {
      const dataObj = new Date(horario.data);
      const dia = dataObj.getDate().toString().padStart(2, '0');
      const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
      return `${dia}/${mes} • ${horario.inicio}`;
    }
    return horario.inicio;
  };

  const getResumoItem = () => {
    if (carrinho.length === 0) return null;
    const item = carrinho[0];
    return {
      nome: item.servico.nome,
      horarioStr: formatarDataHora(item.horario),
      valor: item.servico.valor,
    };
  };

  const isServicoSelecionado = (servicoId: number) => {
    return carrinho.length > 0 && carrinho[0].servico.id === servicoId;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-stone-50 via-white to-stone-100/60 font-sans">
      <Notification
        {...notification}
        onClose={() => setNotification((p: any) => ({ ...p, isOpen: false }))}
      />
      <ConfirmDialog
        {...confirmDialog}
        onCancel={() => setConfirmDialog((p: any) => ({ ...p, isOpen: false }))}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog((p: any) => ({ ...p, isOpen: false }));
        }}
      />

      {/* TELA INICIAL - Estilo preto e branco */}
      {mainScreen === "escolha" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md mb-6 transition-transform hover:scale-105 duration-300">
            <Image
              src="/kingsbarber2.png"
              alt="logo"
              width={90}
              height={90}
              className="rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900">Kings Barber</h1>
          <p className="text-stone-500 mt-2 mb-8">Escolha uma opção</p>
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={iniciarAgendamento}
              className="group w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Fazer agendamento
            </button>
            <button
              onClick={agendamentoGrupo}
              className="group w-full bg-white border-2 border-stone-300 hover:border-stone-400 text-stone-700 font-semibold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5"
            >
              Agendamento em grupo
            </button>
          </div>
        </div>
      )}

      {/* FLUXO DE AGENDAMENTO */}
      {mainScreen === "agendamento" && (
        <>
          <div className="flex flex-col items-center pt-6 pb-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-stone-800 mt-3">Kings Barber</h1>
            <p className="text-stone-500 text-sm">
              {step === "profissionais" && "Escolha um profissional"}
              {step === "servicos" && "Escolha um serviço e horário"}
              {step === "carrinho" && (
                carrinhoStep === "email" ? "Informe seu e-mail" :
                carrinhoStep === "verificacao" ? "Confirme seu e-mail" :
                "Seus dados pessoais"
              )}
            </p>
          </div>

          <div className={`flex-1 max-w-md mx-auto w-full px-5 ${step === "carrinho" ? "pb-32" : "pb-8"}`}>
            {/* PROFISSIONAIS - sem o texto "Clique para selecionar" */}
            {step === "profissionais" && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-stone-800 mb-4">
                  Selecione um profissional
                </h2>
                {barbeiros.map((b: any, idx: number) => (
                  <div
                    key={b.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'backwards' }}
                  >
                    <button
                      onClick={() => handleSelectProfissional(b)}
                      className="group w-full bg-white/70 backdrop-blur-sm border border-stone-200 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-md hover:border-amber-300 focus:ring-2 focus:ring-amber-400"
                    >
                      <p className="font-semibold text-stone-800 text-lg">{b.nome}</p>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* SERVIÇOS */}
            {step === "servicos" && (
              <div className="animate-fade-in">
                <button
                  onClick={() => setStep("profissionais")}
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-800 mb-4 transition-colors"
                >
                  <ArrowLeft size={18} /> Voltar
                </button>
                <h2 className="text-xl font-semibold text-stone-800 mb-3">
                  Selecione um serviço
                </h2>
                <p className="text-sm text-stone-500 mb-4">
                  Clique no ícone para escolher o horário
                </p>
                <div className="space-y-3">
                  {procedimentosBarbeiro.map((servico: any, idx: number) => {
                    const isBeingSelected = tempServico?.id === servico.id && showHorariosModal;
                    const isSelected = isServicoSelecionado(servico.id);
                    return (
                      <div
                        key={servico.id}
                        className={`animate-fade-in group bg-white/80 backdrop-blur-sm border rounded-xl p-4 flex justify-between items-center transition-all duration-300 hover:shadow-md ${
                          isSelected
                            ? "border-green-500 bg-green-50/30 shadow-sm"
                            : "border-stone-200 hover:border-amber-200"
                        } ${isBeingSelected ? "ring-2 ring-amber-400" : ""}`}
                        style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'backwards' }}
                      >
                        <div>
                          <p className="font-medium text-stone-800">{servico.nome}</p>
                          <p className="text-amber-600 font-bold">R$ {servico.valor}</p>
                        </div>
                        <div className="flex gap-2">
                          {isSelected && (
                            <button
                              onClick={removerDoCarrinho}
                              className="w-9 h-9 rounded-full border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-all flex items-center justify-center"
                              title="Remover serviço"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => abrirSelecionarHorario(servico)}
                            disabled={showHorariosModal}
                            className={`
                              w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center
                              ${showHorariosModal
                                ? "border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50"
                                : isSelected
                                ? "border-green-500 bg-green-100 text-green-600 cursor-default"
                                : "border-stone-300 text-stone-500 hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50"
                              }
                            `}
                          >
                            {isBeingSelected ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : isSelected ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <Plus size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CARRINHO */}
            {step === "carrinho" && (
              <div className="animate-fade-in">
                <button
                  onClick={() => setStep("servicos")}
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-800 mb-4 transition-colors"
                >
                  <ArrowLeft size={18} /> Voltar aos serviços
                </button>

                {carrinhoStep === "email" && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm animate-fade-in">
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="email"
                        placeholder="Seu e-mail (obrigatório)"
                        value={cliente.email}
                        onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-black text-stone-800"
                      />
                    </div>
                    <button
                      onClick={enviarCodigoVerificacao}
                      disabled={!cliente.email.trim() || enviandoCodigo}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-stone-800 font-medium py-2 rounded-xl transition-all disabled:opacity-50 border border-stone-300"
                    >
                      {enviandoCodigo ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Enviar código de verificação"}
                    </button>
                  </div>
                )}

                {carrinhoStep === "verificacao" && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm animate-fade-in">
                    <p className="text-sm text-stone-600">
                      Enviamos um código para <strong>{cliente.email}</strong>
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Código de 6 dígitos"
                        value={codigoDigitado}
                        onChange={(e) => setCodigoDigitado(e.target.value)}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-center text-xl tracking-widest text-stone-800"
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={verificarCodigo}
                      disabled={codigoDigitado.length !== 6 || verificando}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-xl transition-all disabled:opacity-50"
                    >
                      {verificando ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Verificar código"}
                    </button>
                    <button
                      onClick={() => setCarrinhoStep("email")}
                      className="w-full text-stone-500 text-sm underline mt-2"
                    >
                      Corrigir e-mail
                    </button>
                  </div>
                )}

                {carrinhoStep === "dados" && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm animate-fade-in">
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Nome completo"
                        value={cliente.nome}
                        onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
                      />
                    </div>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="tel"
                        placeholder="Telefone (com DDD)"
                        value={cliente.telefone}
                        onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
                      />
                    </div>
                    {carrinho.length > 0 && (
                      <button
                        onClick={removerDoCarrinho}
                        className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-xl transition-all border border-red-200"
                      >
                        Remover serviço agendado
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* BARRA FIXA INFERIOR (SERVIÇOS) - Botão Continuar VERDE */}
      {mainScreen === "agendamento" && step === "servicos" && carrinho.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg rounded-t-2xl p-4 animate-slide-up">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Calendar size={16} className="text-stone-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-stone-800">
                  {getResumoItem()?.nome}
                </span>
                <span className="text-xs text-stone-500">
                  {getResumoItem()?.horarioStr} • R$ {getResumoItem()?.valor}
                </span>
              </div>
            </div>
            <button
              onClick={() => setStep("carrinho")}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-full transition-all shadow-md"
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* BARRA FIXA INFERIOR (CARRINHO - etapa dados) Botão Finalizar VERDE */}
      {mainScreen === "agendamento" && step === "carrinho" && carrinho.length > 0 && carrinhoStep === "dados" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-lg rounded-t-2xl p-4 animate-slide-up">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <div>
                <span className="font-medium text-stone-800">{getResumoItem()?.nome}</span>
                <span className="text-stone-500 text-xs ml-2">{getResumoItem()?.horarioStr}</span>
              </div>
              <span className="font-semibold text-amber-600">R$ {getResumoItem()?.valor}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-stone-100">
              <span className="font-semibold text-stone-800">Total</span>
              <span className="font-bold text-amber-600 text-lg">R$ {totalCarrinho.toFixed(2)}</span>
            </div>
            <button
              onClick={finalizarAgendamento}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition-all shadow-md"
            >
              Finalizar agendamento
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE HORÁRIOS */}
      {showHorariosModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowHorariosModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold text-stone-800">
                Escolha um horário para {tempServico?.nome}
              </h3>
              <button
                onClick={() => setShowHorariosModal(false)}
                className="text-stone-400 hover:text-stone-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {horarios.length === 0 ? (
                <p className="col-span-2 text-center text-stone-500 py-8">
                  Nenhum horário disponível.
                </p>
              ) : (
                horarios.map((horario: any, idx: number) => {
                  const dataFormatada = horario.data
                    ? new Date(horario.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                    : '';
                  return (
                    <button
                      key={horario.id}
                      onClick={() => adicionarAoCarrinho(horario)}
                      className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all hover:-translate-y-0.5 animate-fade-in"
                      style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'backwards' }}
                    >
                      {dataFormatada && (
                        <div className="text-xs text-stone-400 mb-1">{dataFormatada}</div>
                      )}
                      <span className="font-medium text-stone-700">{horario.inicio}</span>
                      <span className="text-stone-400 text-xs block">até {horario.fim}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}