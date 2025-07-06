import { config } from '@/config/environment';
import { Family } from '@/models/Family';

const API_BASE_URL = config.API_BASE_URL;

export const familyService = {
  create: async (familyData: Family) => {
    const response = await fetch(`${API_BASE_URL}/families`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(familyData),
    });

    if (!response.ok) throw new Error('Erro ao criar família');
    return response.json();
  },

  update: async (id: string, familyData: Family) => {
    const response = await fetch(`${API_BASE_URL}/families/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(familyData),
    });

    if (!response.ok) throw new Error('Erro ao atualizar família');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/families/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erro ao deletar família');
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/families`);
    if (!response.ok) throw new Error('Erro ao buscar famílias');
    return response.json();
  },
};
