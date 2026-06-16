"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";
import Loader from "app/components/ui/Loader";
import Sidebar from "app/components/ui/Sidebar";
import { Notification } from "app/components/ui/componenteNotificacao";
import { ConfirmDialog } from "app/components/ui/componenteConfirmação";
import { AuthService } from "app/api/services/authAdmin";
import { useProdutos } from "app/hook/useProdutosHook";
import { IProduto } from "app/interfaces/produtosInterface";
import { ResumoCards } from "app/components/produtos/resumoCards";
import { FiltrosSection } from "app/components/produtos/filtrosSection";
import { ListaProdutos } from "app/components/produtos/listaProdutos";
import { ProdutoModal } from "app/components/produtos/produtoModal";
import { ModalConfirmacaoStatus } from "app/components/produtos/modalConfirmaçãoStatus";

const authService = new AuthService();

interface FiltrosState {
  busca: string;
  categoria: string;
  ordenacao: "nome" | "preco" | "estoque";
}

export default function ProdutosPage() {
  const router = useRouter();

  // ---------- Autenticação ----------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ---------- Estado dos produtos ----------
  const {
    produtos,
    loading: loadingProdutos,
    error,
    addProduto,
    updateProduto,
    removeProduto,
    fetchProdutos,
  } = useProdutos();

  // ---------- UI states ----------
  const [collapsed, setCollapsed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // loader overlay
  const [filtros, setFiltros] = useState<FiltrosState>({
    busca: "",
    categoria: "todos",
    ordenacao: "nome",
  });

  // ---------- Modais ----------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IProduto | null>(null);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    produto: IProduto | null;
    novoStatus: IProduto["status"];
    usuarioPendente: string;
  }>({
    isOpen: false,
    produto: null,
    novoStatus: "disponivel",
    usuarioPendente: "",
  });

  // ---------- Notificações e confirmações ----------
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: "info" | "success" | "warning" | "error";
  }>({ isOpen: false, message: "", type: "info" });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "warning" | "error";
    onConfirm: (() => void) | null;
    onCancel?: () => void;
    position?: { top: number; left: number };
    color?: { bg: string; text: string };
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const notify = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    setNotification({ isOpen: true, message: msg, type });
  };

  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: "info" | "warning" | "error" = "info",
    onCancel?: () => void,
    position?: { top: number; left: number }
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      onCancel: onCancel || (() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))),
      position,
    });
  };

  const closeNotification = () => setNotification(prev => ({ ...prev, isOpen: false }));
  const closeConfirmDialog = () => setConfirmDialog(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  const handleConfirm = () => {
    if (confirmDialog.onConfirm) confirmDialog.onConfirm();
    closeConfirmDialog();
  };

  // ---------- Verificação de autenticação (igual ao agendamento) ----------
  useEffect(() => {
    const verifyAuth = async () => {
      setLoadingAuth(true);
      try {
        const valid = await authService.verifyToken();
        if (!valid) router.replace("/login");
        else setIsAuthenticated(true);
      } catch {
        router.replace("/login");
      } finally {
        setLoadingAuth(false);
      }
    };
    verifyAuth();
  }, [router]);

  // ---------- Categorias disponíveis ----------
  const categoriasDisponiveis = useMemo(() => {
    const categorias = produtos.map(p => p.categoria).filter((c): c is string => !!c && c.trim() !== "");
    return Array.from(new Set(categorias)).sort();
  }, [produtos]);

  // ---------- Produtos filtrados ----------
  const produtosFiltrados = useMemo(() => {
    const termo = filtros.busca.toLowerCase();
    const cat = filtros.categoria;

    const filtrados = produtos.filter(p => {
      const nome = p.nome ?? "";
      const categoria = p.categoria ?? "";
      const nomeMatch = nome.toLowerCase().includes(termo);
      const catMatch = cat === "todos" || categoria.toLowerCase() === cat.toLowerCase();
      return nomeMatch && catMatch;
    });

    return filtrados.sort((a, b) => {
      switch (filtros.ordenacao) {
        case "preco": return (b.preco || 0) - (a.preco || 0);
        case "estoque": return (b.estoque || 0) - (a.estoque || 0);
        case "nome": default: return (a.nome || "").localeCompare(b.nome || "");
      }
    });
  }, [produtos, filtros]);

  // ---------- Totais para os cards ----------
  const totais = useMemo(() => {
    const totalValor = produtos.reduce((acc, p) => acc + (p.preco || 0), 0);
    const totalItens = produtos.reduce((acc, p) => acc + (p.estoque || 0), 0);
    return { totalValor, totalItens, quantidade: produtos.length };
  }, [produtos]);

  // ---------- Handlers ----------
  const handleAtualizarLista = async () => {
    try {
      await fetchProdutos();
      notify("Lista de produtos atualizada", "success");
    } catch {
      notify("Erro ao atualizar lista", "error");
    }
  };

  const handleSalvarProduto = async (payload: Partial<IProduto>) => {
    setIsProcessing(true);
    try {
      const preco = payload.preco ? Number(String(payload.preco).replace(",", ".")) : 0;
      const estoque = Number(payload.estoque) || 0;

      if (preco <= 0) throw new Error("O preço deve ser maior que zero");
      if (estoque <= 0) throw new Error("O estoque deve ser maior que zero");

      const dadosParaEnvio: Partial<IProduto> = {
        nome: payload.nome?.trim() || "",
        categoria: payload.categoria?.trim() || "",
        preco,
        estoque,
        descricao: payload.descricao?.trim() || "",
        status: payload.status ?? (editing ? editing.status : "disponivel"),
        usuarioPendente: payload.status === "pendente"
          ? payload.usuarioPendente?.trim() || ""
          : "",
      };

      if (editing) {
        await updateProduto(editing.id, dadosParaEnvio);
        notify("Produto atualizado com sucesso", "success");
      } else {
        await addProduto(dadosParaEnvio as any);
        notify("Produto criado com sucesso", "success");
      }

      setIsModalOpen(false);
      setEditing(null);
    } catch (err: any) {
      notify(err?.message || "Erro ao salvar produto", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExcluir = async (id: string, event?: React.MouseEvent) => {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    if (produto.status === "pendente") {
      notify("Só é possível excluir quando o produto estiver pago.", "warning");
      return;
    }

    // Captura posição para o confirm dialog (opcional)
    let position;
    if (event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      position = { top: rect.top + window.scrollY, left: rect.left + rect.width / 2 };
    }

    confirm(
      "Excluir Produto",
      `Tem certeza que deseja excluir o produto "${produto.nome}"?`,
      async () => {
        setIsProcessing(true);
        try {
          await removeProduto(id);
          notify("Produto deletado", "success");
          await fetchProdutos();
        } catch {
          notify("Erro ao deletar produto", "error");
        } finally {
          setIsProcessing(false);
        }
      },
      "error",
      undefined,
      position
    );
  };

  const handleConfirmarStatus = async () => {
    const { produto, novoStatus, usuarioPendente } = statusModal;
    if (!produto) return;

    setIsProcessing(true);
    try {
      const dadosAtualizacao: Partial<IProduto> = {
        ...produto,
        status: novoStatus,
        usuarioPendente: novoStatus === "pendente" ? usuarioPendente?.trim() || "" : "",
      };
      await updateProduto(produto.id, dadosAtualizacao);
      notify(`Status atualizado para ${novoStatus}`, "success");
      closeStatusModal();
    } catch (err) {
      console.error(err);
      notify("Erro ao atualizar status", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const openProdutoModal = (produto?: IProduto) => {
    setEditing(produto || null);
    setIsModalOpen(true);
  };

  const closeProdutoModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const openStatusModal = (produto: IProduto, novoStatus?: IProduto["status"]) => {
    setStatusModal({
      isOpen: true,
      produto,
      novoStatus: novoStatus || produto.status,
      usuarioPendente: produto.usuarioPendente || "",
    });
  };

  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, produto: null, novoStatus: "disponivel", usuarioPendente: "" });
  };

  const getStatusColor = (status: string | undefined) => {
    const s = status || "disponivel";
    switch (s) {
      case "disponivel": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "vendido": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "consumido": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "pendente": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const mostrarAlerta = (mensagem: string, callback: () => void) => {
    confirm("Alterar Status", mensagem, callback, "info");
  };

  const atualizarFiltro = (campo: keyof FiltrosState, valor: string) =>
    setFiltros(prev => ({ ...prev, [campo]: valor }));

  const limparFiltros = () => setFiltros({ busca: "", categoria: "todos", ordenacao: "nome" });

  if (loadingAuth || loadingProdutos) return <Loader fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <>
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={handleConfirm}
        onCancel={closeConfirmDialog}
      />

      <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5]">
        <aside className="flex-shrink-0 h-screen lg:sticky top-0 z-20">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-hidden">
            {/* Cabeçalho com botões padronizados */}
            <div className="mb-6 sm:mb-8 flex-shrink-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#FFA500] mb-1 flex items-center gap-2 sm:gap-3">
                      <span className="text-3xl sm:text-4xl">📦</span>
                      <span className="truncate">Produtos</span>
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base truncate">
                      Gerencie seu catálogo de produtos
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      onClick={handleAtualizarLista}
                      className="px-4 py-2 text-sm"
                    >
                      🔄 Atualizar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => openProdutoModal()}
                      className="px-4 py-2 text-sm"
                    >
                      ➕ Novo Produto
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 gap-6">
              {/* Cards de resumo */}
              <ResumoCards
                totalProdutos={totais.quantidade}
                totalValor={totais.totalValor}
                totalItens={totais.totalItens}
              />

              {/* Seção de filtros (estilo agendamento) */}
              <FiltrosSection
                filtros={filtros}
                categoriasDisponiveis={categoriasDisponiveis}
                produtosFiltradosCount={produtosFiltrados.length}
                produtosTotalCount={produtos.length}
                onFiltroChange={atualizarFiltro}
                onLimparFiltros={limparFiltros}
              />

              {/* Lista de produtos com cards padronizados */}
              <ListaProdutos
                produtos={produtosFiltrados}
                produtosTotal={produtos.length}
                ordenacao={filtros.ordenacao}
                onEdit={openProdutoModal}
                onDelete={handleExcluir}
                onUpdateStatus={(produto, novoStatus) => openStatusModal(produto, novoStatus)}
                getStatusColor={getStatusColor}
                onLimparFiltros={limparFiltros}
                filtrosAtivos={!!(filtros.busca || filtros.categoria !== "todos")}
                mostrarAlerta={mostrarAlerta}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Modal de produto (estilo agendamento) */}
      {isModalOpen && (
        <ProdutoModal
          initial={editing ?? undefined}
          onClose={closeProdutoModal}
          onSave={handleSalvarProduto}
          categoriasSugeridas={categoriasDisponiveis}
        />
      )}

      {/* Modal de confirmação de status */}
      {statusModal.isOpen && (
        <ModalConfirmacaoStatus
          produto={statusModal.produto}
          novoStatus={statusModal.novoStatus}
          usuarioPendente={statusModal.usuarioPendente}
          onUsuarioPendenteChange={(usuario) =>
            setStatusModal(prev => ({ ...prev, usuarioPendente: usuario }))
          }
          onConfirm={handleConfirmarStatus}
          onCancel={closeStatusModal}
        />
      )}

      {/* Loader overlay para operações longas */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader size={60} color="#FFA500" />
        </div>
      )}

      {/* Scrollbar customizada (igual ao agendamento) */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4B5563;
          border-radius: 10px;
        }
        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: #1F2937;
          border-radius: 10px;
        }
        .scrollbar-thumb-gray-500::-webkit-scrollbar-thumb:hover {
          background-color: #6B7280;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #4B5563 #1F2937;
        }
      `}</style>
    </>
  );
}