"use client";

import React, { useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  ArrowLeft,
  Check,
  Clock3,
} from "lucide-react";

import { ProfessionalsStep } from "./components/agendamentoPublic/ProfissionalStep";
import { ServicesStep } from "./components/agendamentoPublic/ServicesStep";
import { CodeVerification } from "./components/agendamentoPublic/CodeVerification";
import { CartBottomBar } from "./components/agendamentoPublic/BottomActionBar";
import { HorariosModal } from "./components/agendamentoPublic/HorariosModal";
import { ConfirmDialog } from "./components/ui/componenteConfirmação";
import InitialScreen from "./components/agendamentoPublic/initialScreen";

import { useAgendamentoFlow } from "./hook/useAgendamentoFlow";
import { useEmailVerification } from "./hook/useEmailVerification";
import { EmailVerification } from "./components/agendamentoPublic/EmailVerification";
import { SuccessScreen } from "./components/agendamentoPublic/SucessScreen";

interface PessoaGrupo {
  id: string;
  nome: string;
}

interface GrupoAgendamento {
  pessoaId: string;
  pessoaNome: string;
  profissional?: any;
  servico?: any;
  horario?: any;
  completo: boolean;
}

function formatMoney(value: number | string) {
  const numero = Number(value || 0);
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatHorarioCompleto(horario: any) {
  if (!horario || !horario.data || !horario.inicio) return "";
  const [ano, mes, dia] = horario.data.split("-");
  if (!ano || !mes || !dia) return horario.inicio;
  return `${dia}/${mes}/${ano} ${horario.inicio}`;
}

function BackButton({ onClick, label = "Voltar" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl px-3 py-2 transition-colors duration-200 w-fit"
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}

function GroupMembersStep({
  pessoas,
  agendamentos,
  onAddPessoa,
  onUpdateNome,
  onSelecionarPessoa,
  onBack,
}: {
  pessoas: PessoaGrupo[];
  agendamentos: GrupoAgendamento[];
  onAddPessoa: () => void;
  onUpdateNome: (id: string, nome: string) => void;
  onSelecionarPessoa: (pessoa: PessoaGrupo) => void;
  onBack: () => void;
}) {
  const totalCompletos = agendamentos.filter((a) => a.completo).length;

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} />

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-base text-stone-800">Participantes</h2>
            <p className="text-xs text-stone-500">Configure os agendamentos do grupo</p>
          </div>
          <button
            onClick={onAddPessoa}
            className="bg-stone-900 text-white rounded-lg px-2.5 py-1.5 flex items-center gap-1 text-xs"
          >
            <Plus size={14} />
            Adicionar
          </button>
        </div>

        <div className="px-4 pt-3">
          <div className="flex gap-1">
            {pessoas.map((pessoa) => {
              const completo = agendamentos.some((a) => a.pessoaId === pessoa.id && a.completo);
              return (
                <div
                  key={pessoa.id}
                  className={`h-1.5 flex-1 rounded-full ${completo ? "bg-green-500" : "bg-stone-200"}`}
                />
              );
            })}
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5">
            {totalCompletos} de {pessoas.length} completos
          </p>
        </div>

        <div className="p-4 space-y-3">
          {pessoas.map((pessoa, index) => {
            const agendamento = agendamentos.find((a) => a.pessoaId === pessoa.id);
            return (
              <div key={pessoa.id} className="border border-stone-200 rounded-xl p-3">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      value={pessoa.nome}
                      onChange={(e) => onUpdateNome(pessoa.id, e.target.value)}
                      placeholder="Nome da pessoa"
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-black outline-none focus:border-amber-500"
                    />
                    {agendamento?.completo ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 text-green-700 font-medium text-xs">
                          <Check size={14} />
                          Configurado
                        </div>
                        <div className="mt-1 text-xs text-stone-600 space-y-0.5">
                          <p><span className="font-medium">Procedimento:</span> {agendamento.servico?.nome}</p>
                          <p><span className="font-medium">Profissional:</span> {agendamento.profissional?.nome}</p>
                          <p><span className="font-medium">Horário:</span> {formatHorarioCompleto(agendamento.horario)}</p>
                          <p><span className="font-medium">Valor:</span> {formatMoney(agendamento.servico?.valor)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600 text-xs">
                        <Clock3 size={13} />
                        Falta configurar
                      </div>
                    )}
                    <button
                      disabled={!pessoa.nome.trim()}
                      onClick={() => onSelecionarPessoa(pessoa)}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white rounded-lg py-2 text-sm font-medium transition"
                    >
                      {agendamento?.completo ? "Editar agendamento" : "Configurar agendamento"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const flow = useAgendamentoFlow();

  // ✅ selectedProfissional deve estar disponível no hook
  const {
    mainScreen,
    step,
    cartSubStep,
    carrinho,
    cliente,
    tempServico,
    loading,
    error,
    profissionais,
    horariosDisponiveis,
    servicosDoProfissional,
    totalCarrinho,
    showHorariosModal,
    confirmDialog,
    setCartSubStep,
    setCliente,
    setShowHorariosModal,
    setTempServico,
    setConfirmDialog,
    setSelectedProfissional,
    selectedProfissional,      
    setStep,
    setMainScreen,
    adicionarAoCarrinho,
    removerDoCarrinho,
    finalizarAgendamento,
    iniciarAgendamento,
    notify,
  } = flow;

  const [tipoAgendamento, setTipoAgendamento] = useState<"normal" | "grupo">("normal");
  const [pessoasGrupo, setPessoasGrupo] = useState<PessoaGrupo[]>([{ id: crypto.randomUUID(), nome: "" }]);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<PessoaGrupo | null>(null);
  const [profissionalSelecionadoGrupo, setProfissionalSelecionadoGrupo] = useState<any>(null);
  const [grupoAgendamentos, setGrupoAgendamentos] = useState<GrupoAgendamento[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEmailVerified = async () => {
    try {
      await finalizarAgendamento();
      setShowSuccess(true);
    } catch (err) {
      notify("Erro ao finalizar agendamento.", "error");
    }
  };

  const emailVerification = useEmailVerification({
    email: cliente.email,
    onSuccess: handleEmailVerified,
  });


  const handleEnviarCodigo = async () => {
    let agendamentoPayload: any;

    if (tipoAgendamento === "normal") {
      if (carrinho.length === 0) {
        notify("Nenhum serviço selecionado.", "warning");
        return;
      }

      const agendamento = carrinho[0];

      agendamentoPayload = {
        tipo: "normal",
        cliente: {
          nome: cliente.nome,
          email: cliente.email,
        },
        servico: {
          id: agendamento.servico?.id,
          nome: agendamento.servico?.nome,
          valor: agendamento.servico?.valor,
        },
        profissional: {
          id: agendamento.profissional?.id,
          nome: agendamento.profissional?.nome,
        },
        horario: {
          id: agendamento.horario?.id,
          data: agendamento.horario?.data,
          inicio: agendamento.horario?.inicio,
          fim: agendamento.horario?.fim,
        },
      };
    } else {
      if (grupoAgendamentos.length === 0) {
        notify("Nenhum agendamento configurado para o grupo.", "warning");
        return;
      }

      const participantes = grupoAgendamentos.map((item) => ({
        pessoaId: item.pessoaId,
        pessoaNome: item.pessoaNome,
        servico: {
          id: item.servico?.id,
          nome: item.servico?.nome,
          valor: item.servico?.valor,
        },
        profissional: {
          id: item.profissional?.id,
          nome: item.profissional?.nome,
        },
        horario: {
          id: item.horario?.id,
          data: item.horario?.data,
          inicio: item.horario?.inicio,
          fim: item.horario?.fim,
        },
      }));

      agendamentoPayload = {
        tipo: "grupo",
        cliente: {
          nome: cliente.nome,
          email: cliente.email,
        },
        participantes,
      };
    }

    await emailVerification.enviarCodigo(notify, agendamentoPayload);
  };

  const horariosBloqueados = useMemo(() => {
    return grupoAgendamentos.map((item) => `${item?.horario?.data}-${item?.horario?.inicio}`);
  }, [grupoAgendamentos]);

  const horariosFiltrados = useMemo(() => {
    return horariosDisponiveis.filter((horario: any) => {
      const chave = `${horario?.data}-${horario?.inicio}`;
      return !horariosBloqueados.includes(chave);
    });
  }, [horariosDisponiveis, horariosBloqueados]);

  function adicionarPessoaGrupo() {
    setPessoasGrupo((prev) => [...prev, { id: crypto.randomUUID(), nome: "" }]);
  }
  function alterarNomePessoa(id: string, nome: string) {
    setPessoasGrupo((prev) => prev.map((p) => (p.id === id ? { ...p, nome } : p)));
  }
  function salvarAgendamentoGrupo(horario: any) {
    if (!pessoaSelecionada) return notify("Selecione uma pessoa.", "warning");
    if (!tempServico) return notify("Selecione um serviço.", "warning");
    if (!profissionalSelecionadoGrupo) return notify("Selecione um profissional.", "warning");

    const horarioExiste = grupoAgendamentos.some(
      (item) =>
        item?.horario?.data === horario?.data &&
        item?.horario?.inicio === horario?.inicio &&
        item.pessoaId !== pessoaSelecionada.id
    );
    if (horarioExiste) return notify("Esse horário já foi selecionado.", "warning");

    adicionarAoCarrinho({
      servico: tempServico,
      profissional: profissionalSelecionadoGrupo,
      horario: horario,
      pessoaGrupo: { id: pessoaSelecionada.id, nome: pessoaSelecionada.nome },
    });

    setGrupoAgendamentos((prev) => [
      ...prev.filter((i) => i.pessoaId !== pessoaSelecionada.id),
      {
        pessoaId: pessoaSelecionada.id,
        pessoaNome: pessoaSelecionada.nome,
        profissional: profissionalSelecionadoGrupo,
        servico: tempServico,
        horario,
        completo: true,
      },
    ]);

    setShowHorariosModal(false);
    setTempServico(null);
    setProfissionalSelecionadoGrupo(null);
    setPessoaSelecionada(null);
    setStep("membros");
    notify("Agendamento salvo.", "success");
  }

  // Condições de validação para o grupo
  const todosGrupoCompletos =
    pessoasGrupo.length > 0 &&
    pessoasGrupo.every((pessoa) => grupoAgendamentos.some((a) => a.pessoaId === pessoa.id && a.completo));
  const podeAvancarGrupo = todosGrupoCompletos && pessoasGrupo.length >= 2;

  const avisoGrupo = !podeAvancarGrupo ? (
    pessoasGrupo.length < 2 ? (
      <p className="text-xs text-amber-600 text-center mt-2">
        Adicione pelo menos <strong>2 pessoas</strong> para fazer um agendamento em grupo.
      </p>
    ) : !todosGrupoCompletos ? (
      <p className="text-xs text-amber-600 text-center mt-2">
        Configure o agendamento de <strong>todas as pessoas</strong> antes de continuar.
      </p>
    ) : null
  ) : null;

  // Loading e error
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 size={40} className="animate-spin text-amber-600" />
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-lg max-w-sm w-full">
        <h2 className="text-red-600 font-bold text-lg">Ocorreu um erro</h2>
        <p className="text-stone-600 mt-2 text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm">
          Recarregar
        </button>
      </div>
    </div>
  );

  if (showSuccess) {
    return <SuccessScreen onClose={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ConfirmDialog
        {...confirmDialog}
        onCancel={() => setConfirmDialog((prev: any) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog((prev: any) => ({ ...prev, isOpen: false }));
        }}
      />

      {mainScreen === "escolha" && (
        <InitialScreen
          onAgendamentoClick={() => {
            setTipoAgendamento("normal");
            iniciarAgendamento();
          }}
          onGrupoClick={() => {
            setTipoAgendamento("grupo");
            iniciarAgendamento();
            setStep("membros");
            notify("Modo grupo ativado", "info");
          }}
        />
      )}

      {mainScreen === "agendamento" && (
        <>
          <div className="pt-6 pb-3 px-5 text-center border-b border-stone-100">
            <h1 className="text-2xl font-bold text-stone-900">Kings Barber</h1>
            <p className="text-stone-500 text-xs mt-0.5">
              {tipoAgendamento === "grupo" ? "Agendamento em grupo" : "Agendamento"}
            </p>
          </div>

          <div className={`flex-1 w-full max-w-sm mx-auto px-4 ${step === "carrinho" ? "pb-28" : "pb-36"}`}>
            {step === "membros" && tipoAgendamento === "grupo" && (
              <GroupMembersStep
                pessoas={pessoasGrupo}
                agendamentos={grupoAgendamentos}
                onAddPessoa={adicionarPessoaGrupo}
                onUpdateNome={alterarNomePessoa}
                onSelecionarPessoa={(pessoa) => {
                  setPessoaSelecionada(pessoa);
                  setStep("profissionais");
                }}
                onBack={() => setMainScreen("escolha")}
              />
            )}

            {step === "profissionais" && (
              <div className="space-y-4">
                <BackButton onClick={() => tipoAgendamento === "grupo" ? setStep("membros") : setMainScreen("escolha")} />
                <ProfessionalsStep
                  profissionais={profissionais}
                  onSelect={(profissional) => {
                    setSelectedProfissional(profissional);
                    if (tipoAgendamento === "grupo") setProfissionalSelecionadoGrupo(profissional);
                    setStep("servicos");
                  }}
                />
              </div>
            )}

            {step === "servicos" && (
              <div className="space-y-4">
                <BackButton onClick={() => setStep("profissionais")} />
                <ServicesStep
                  servicos={servicosDoProfissional}
                  horariosCount={tipoAgendamento === "grupo" ? horariosFiltrados.length : horariosDisponiveis.length}
                  selectedServicoId={tempServico?.id}
                  onBack={() => setStep("profissionais")}
                  onAddHorario={(servico) => {
                    setTempServico(servico);
                    setShowHorariosModal(true);
                  }}
                  onRemove={removerDoCarrinho}
                  isAdding={showHorariosModal}
                />
              </div>
            )}

            {step === "carrinho" && (
              <div className="space-y-3">
                {cartSubStep === "email" && (
                  <EmailVerification
                    nome={cliente.nome}
                    email={cliente.email}
                    onNomeChange={(nome) => setCliente((prev) => ({ ...prev, nome }))}
                    onEmailChange={(email) => setCliente((prev) => ({ ...prev, email }))}
                    onEnviarCodigo={handleEnviarCodigo}
                    onVerificarCodigo={(codigo: string) =>
                      emailVerification.verificarCodigo(codigo, notify)
                    }
                    onVoltar={() => setStep("servicos")}
                    enviando={emailVerification.enviandoCodigo}
                    verificando={emailVerification.verificando}
                    disabled={false}
                  />
                )}
                {cartSubStep === "verificacao" && (
                  <CodeVerification
                    email={cliente.email}
                    codigo={emailVerification.codigoDigitado}
                    onCodigoChange={emailVerification.setCodigoDigitado}
                    onVerificar={() =>
                      emailVerification.verificarCodigo(emailVerification.codigoDigitado, notify)
                    }
                    onCorrigirEmail={() => {
                      emailVerification.reset();
                      setCartSubStep("email");
                    }}
                    verificando={emailVerification.verificando}
                  />
                )}
              </div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none">
            <div className="w-full max-w-sm pointer-events-auto px-4 pb-5">
              {step === "servicos" && tipoAgendamento === "normal" && carrinho.length > 0 && (
                <CartBottomBar
                  nomeServico={carrinho[0]?.servico?.nome || ""}
                  horarioStr={formatHorarioCompleto(carrinho[0]?.horario)}
                  valor={Number(carrinho[0]?.servico?.valor || 0)}
                  total={Number(carrinho[0]?.servico?.valor || 0)}
                  onFinalizar={() => setStep("carrinho")}
                  buttonLabel="Continuar"
                />
              )}

              {step === "membros" && tipoAgendamento === "grupo" && grupoAgendamentos.length > 0 && (
                <>
                  <CartBottomBar
                    nomeServico={`${grupoAgendamentos.length} agendamento${grupoAgendamentos.length > 1 ? "s" : ""}`}
                    horarioStr={`${grupoAgendamentos.filter((a) => a.completo).length} configurados`}
                    valor={totalCarrinho}
                    total={totalCarrinho}
                    onFinalizar={() => setStep("carrinho")}
                    buttonLabel="Continuar"
                    disabled={!podeAvancarGrupo}
                  />
                  {avisoGrupo}
                </>
              )}
            </div>
          </div>
        </>
      )}

      <HorariosModal
        isOpen={showHorariosModal}
        servicoNome={tempServico?.nome}
        horarios={tipoAgendamento === "grupo" ? horariosFiltrados : horariosDisponiveis}
        onClose={() => setShowHorariosModal(false)}
        onSelectHorario={(horario) => {
          if (tipoAgendamento === "normal") {
            if (!tempServico || !selectedProfissional) {
              notify("Selecione um serviço e um profissional antes de escolher o horário.", "warning");
              return;
            }
            adicionarAoCarrinho({
              servico: tempServico,
              profissional: selectedProfissional,
              horario: horario,
            });
            setShowHorariosModal(false);
          } else {
            salvarAgendamentoGrupo(horario);
          }
        }}
      />
    </div>
  );
}