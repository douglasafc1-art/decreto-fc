import { useEffect, useState, useCallback, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para consultas assíncronas com refetch aguardável.
 * Um contador de requisições impede que respostas antigas sobrescrevam uma
 * consulta mais recente quando duas chamadas acontecem em sequência.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const requestId = useRef(0);

  const refetch = useCallback(async () => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const data = await fn();
      if (id === requestId.current) {
        setState({ data, loading: false, error: null });
      }
      return data;
    } catch (err) {
      if (id === requestId.current) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Erro ao carregar dados.',
        });
      }
      throw err;
    }
    // fn é recriada nos componentes; deps é a fonte de verdade intencional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    void refetch().catch(() => undefined);
    return () => {
      requestId.current += 1;
    };
  }, [refetch]);

  return { ...state, refetch };
}
