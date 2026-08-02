import { config } from '@/config/environment';
import { authHeaders } from './headers';

const BASE = `${config.API_BASE_URL}/donations`;

export const donationService = {
  getAll: async () => {
    const r = await fetch(BASE, { headers: authHeaders() });
    if (!r.ok) throw new Error('Erro ao buscar arrecadações');
    return r.json();
  },

  create: async (data: any) => {
    const r = await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error('Erro ao criar arrecadação');
    return r.json();
  },

  update: async (id: string, data: any) => {
    const r = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error('Erro ao atualizar arrecadação');
    return r.json();
  },

  delete: async (id: string) => {
    const r = await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!r.ok) throw new Error('Erro ao deletar arrecadação');
  },
};
