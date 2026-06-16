import { ProductService } from "app/api/services/produtosApi";
import { IProduto } from "app/interfaces/produtosInterface";
import { useState, useEffect, useRef, useCallback } from "react";

const produtoService = new ProductService();

export function useProdutos() {
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);

  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await produtoService.fetchProdutos();

      if (mounted.current) {
        setProdutos(data);
      }
    } catch (err: any) {
      console.error(err);

      if (mounted.current) {
        setError(err.message || "Erro ao carregar produtos");
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    fetchProdutos();

    return () => {
      mounted.current = false;
    };
  }, [fetchProdutos]);

  const addProduto = useCallback(
  async (produto: Omit<IProduto, "id">) => {
    setError(null);

    try {
      const preco = produto.preco ?? 0;
      const estoque = produto.estoque ?? 0;

      if (preco <= 0) {
        throw new Error("O preço deve ser maior que zero");
      }

      if (estoque <= 0) {
        throw new Error("O estoque deve ser maior que zero");
      }

      await produtoService.createProduto(produto);

      await fetchProdutos();

      return true;
    } catch (err: any) {
      console.error(err);

      if (mounted.current) {
        setError(err.message || "Erro ao adicionar produto");
      }

      throw err;
    }
  },
  [fetchProdutos]
); 

 const updateProduto = useCallback(
  async (
    id: string,
    produto: Partial<Omit<IProduto, "id">>
  ) => {
    setError(null);

    try {
      if (
        produto.preco !== undefined &&
        (produto.preco ?? 0) <= 0
      ) {
        throw new Error("O preço deve ser maior que zero");
      }

      if (
        produto.estoque !== undefined &&
        (produto.estoque ?? 0) <= 0
      ) {
        throw new Error("O estoque deve ser maior que zero");
      }

      const atualizado = await produtoService.updateProduto(
        id,
        produto
      );

      if (mounted.current) {
        setProdutos((prev) =>
          prev.map((item) => {
            if (item.id !== id) return item;

            return {
              ...item,
              ...produto,
              ...(atualizado || {}),
            };
          })
        );
      }

      return atualizado;
    } catch (err: any) {
      console.error(err);

      if (mounted.current) {
        setError(
          err.message || "Erro ao atualizar produto"
        );
      }

      throw err;
    }
  },
  []
);

  const updateStatusProduto = useCallback(
    async (
      produto: IProduto,
      novoStatus: IProduto["status"]
    ) => {
      if (produto.status === "vendido") return;

      const dadosAtualizacao: Partial<IProduto> = {
        ...produto,
        status: novoStatus,
        usuarioPendente:
          novoStatus === "pendente"
            ? produto.usuarioPendente || ""
            : "",
      };

      const atualizado = await updateProduto(
        produto.id,
        dadosAtualizacao
      );

      if (atualizado && mounted.current) {
        setProdutos((prev) =>
          prev.map((item) =>
            item.id === produto.id ? atualizado : item
          )
        );
      }
    },
    [updateProduto]
  );

  const removeProduto = useCallback(
    async (id: string) => {
      setError(null);

      try {
        await produtoService.deleteProduto(id);

        if (mounted.current) {
          setProdutos((prev) =>
            prev.filter((item) => item.id !== id)
          );
        }
      } catch (err: any) {
        console.error(err);

        if (mounted.current) {
          setError(err.message || "Erro ao remover produto");
        }

        throw err;
      }
    },
    []
  );

  return {
    produtos,
    loading,
    error,
    fetchProdutos,
    addProduto,
    updateProduto,
    updateStatusProduto,
    removeProduto,
  };
}