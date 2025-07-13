
import { useState } from 'react';

interface CepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  complemento?: string;
}

export function useCep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCep = async (cep: string): Promise<CepData | null> => {
    if (cep.length !== 8) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return data;
    } catch (err) {
      setError('Erro ao buscar CEP');
      console.error('Erro ao buscar CEP:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCep, loading, error };
}
